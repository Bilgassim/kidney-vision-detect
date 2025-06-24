
# Guide de Déploiement Cloud - KidneyVision

## ☁️ Vue d'Ensemble

Ce guide couvre le déploiement de KidneyVision sur les principales plateformes cloud : AWS, Google Cloud Platform (GCP), et Microsoft Azure.

## 🏗️ Architecture Cloud

```
Internet
    ↓
Load Balancer
    ↓
┌─────────────────┬─────────────────┐
│   Frontend      │    Backend      │
│   (React SPA)   │   (FastAPI)     │
│                 │                 │
│   - Nginx       │   - Gunicorn    │
│   - Static      │   - AI Model    │
│   - Assets      │   - File Upload │
└─────────────────┴─────────────────┘
    ↓                    ↓
CDN/Storage         Database/Storage
```

## 🚀 AWS Deployment

### 1. Architecture AWS

```
Route 53 (DNS)
    ↓
CloudFront (CDN)
    ↓
Application Load Balancer
    ↓
┌─────────────────┬─────────────────┐
│   ECS Fargate   │   ECS Fargate   │
│   (Frontend)    │   (Backend)     │
└─────────────────┴─────────────────┘
    ↓                    ↓
    S3              RDS + S3
```

### 2. Prérequis AWS

```bash
# Installer AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configurer AWS CLI
aws configure
# AWS Access Key ID: [Your Access Key]
# AWS Secret Access Key: [Your Secret Key]
# Default region name: us-east-1
# Default output format: json

# Installer AWS CDK (optionnel)
npm install -g aws-cdk
```

### 3. Déploiement avec ECS

```bash
# 1. Créer un repository ECR
aws ecr create-repository --repository-name kidneyvision-backend
aws ecr create-repository --repository-name kidneyvision-frontend

# 2. Build et push des images
$(aws ecr get-login --no-include-email --region us-east-1)

# Backend
docker build -t kidneyvision-backend ./backend
docker tag kidneyvision-backend:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/kidneyvision-backend:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/kidneyvision-backend:latest

# Frontend
docker build -t kidneyvision-frontend ./frontend
docker tag kidneyvision-frontend:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/kidneyvision-frontend:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/kidneyvision-frontend:latest
```

### 4. Configuration ECS Task Definition

```json
{
  "family": "kidneyvision-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/kidneyvision-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DATABASE_URL",
          "value": "postgresql://user:pass@rds-endpoint:5432/kidneyvision"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/kidneyvision-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### 5. Terraform Configuration (Optionnel)

```hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

# ECS Cluster
resource "aws_ecs_cluster" "kidneyvision" {
  name = "kidneyvision-cluster"
}

# RDS Instance
resource "aws_db_instance" "postgres" {
  identifier = "kidneyvision-db"
  engine     = "postgres"
  engine_version = "13.7"
  instance_class = "db.t3.micro"
  allocated_storage = 20
  
  db_name  = "kidneyvision"
  username = "admin"
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  skip_final_snapshot = true
}

# S3 Bucket pour les uploads
resource "aws_s3_bucket" "uploads" {
  bucket = "kidneyvision-uploads-${random_string.suffix.result}"
}
```

## 🟦 Google Cloud Platform (GCP)

### 1. Architecture GCP

```
Cloud DNS
    ↓
Cloud CDN
    ↓
Cloud Load Balancer
    ↓
┌─────────────────┬─────────────────┐
│   Cloud Run     │   Cloud Run     │
│   (Frontend)    │   (Backend)     │
└─────────────────┴─────────────────┘
    ↓                    ↓
Cloud Storage      Cloud SQL + Storage
```

### 2. Prérequis GCP

```bash
# Installer Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Initialiser gcloud
gcloud init
gcloud auth login
gcloud config set project your-project-id
```

### 3. Déploiement avec Cloud Run

```bash
# 1. Build et push vers Container Registry
gcloud builds submit --tag gcr.io/your-project-id/kidneyvision-backend ./backend
gcloud builds submit --tag gcr.io/your-project-id/kidneyvision-frontend ./frontend

# 2. Déployer sur Cloud Run
gcloud run deploy kidneyvision-backend \
  --image gcr.io/your-project-id/kidneyvision-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="postgresql://user:pass@host/db" \
  --memory 2Gi \
  --cpu 2

gcloud run deploy kidneyvision-frontend \
  --image gcr.io/your-project-id/kidneyvision-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars VITE_API_URL="https://kidneyvision-backend-xxx-uc.a.run.app"
```

### 4. Configuration Cloud Build

```yaml
# cloudbuild.yaml
steps:
  # Build backend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/kidneyvision-backend', './backend']
  
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/kidneyvision-backend']
  
  # Build frontend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/kidneyvision-frontend', './frontend']
  
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/kidneyvision-frontend']
  
  # Deploy to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args: ['run', 'deploy', 'kidneyvision-backend',
           '--image', 'gcr.io/$PROJECT_ID/kidneyvision-backend',
           '--region', 'us-central1',
           '--platform', 'managed',
           '--allow-unauthenticated']
```

## 🔷 Microsoft Azure

### 1. Architecture Azure

```
Azure DNS
    ↓
Azure Front Door
    ↓
Application Gateway
    ↓
┌─────────────────┬─────────────────┐
│ Container       │ Container       │
│ Instances       │ Instances       │
│ (Frontend)      │ (Backend)       │
└─────────────────┴─────────────────┘
    ↓                    ↓
Blob Storage      Azure SQL + Storage
```

### 2. Prérequis Azure

```bash
# Installer Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Se connecter à Azure
az login
az account set --subscription "your-subscription-id"
```

### 3. Déploiement avec Container Instances

```bash
# 1. Créer un groupe de ressources
az group create --name kidneyvision-rg --location eastus

# 2. Créer un registre de containers
az acr create --resource-group kidneyvision-rg --name kidneyvisionregistry --sku Basic
az acr login --name kidneyvisionregistry

# 3. Build et push des images
docker build -t kidneyvisionregistry.azurecr.io/backend:latest ./backend
docker build -t kidneyvisionregistry.azurecr.io/frontend:latest ./frontend

docker push kidneyvisionregistry.azurecr.io/backend:latest
docker push kidneyvisionregistry.azurecr.io/frontend:latest

# 4. Déployer les containers
az container create \
  --resource-group kidneyvision-rg \
  --name kidneyvision-backend \
  --image kidneyvisionregistry.azurecr.io/backend:latest \
  --cpu 2 --memory 4 \
  --registry-login-server kidneyvisionregistry.azurecr.io \
  --registry-username kidneyvisionregistry \
  --registry-password $(az acr credential show --name kidneyvisionregistry --query "passwords[0].value" -o tsv) \
  --ip-address public \
  --ports 8000 \
  --environment-variables DATABASE_URL="postgresql://user:pass@host/db"
```

### 4. ARM Template (Infrastructure as Code)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "containerGroupName": {
      "type": "string",
      "defaultValue": "kidneyvision-group"
    }
  },
  "resources": [
    {
      "type": "Microsoft.ContainerInstance/containerGroups",
      "apiVersion": "2021-09-01",
      "name": "[parameters('containerGroupName')]",
      "location": "[resourceGroup().location]",
      "properties": {
        "containers": [
          {
            "name": "backend",
            "properties": {
              "image": "kidneyvisionregistry.azurecr.io/backend:latest",
              "ports": [
                {
                  "port": 8000
                }
              ],
              "resources": {
                "requests": {
                  "cpu": 2,
                  "memoryInGB": 4
                }
              }
            }
          }
        ],
        "osType": "Linux",
        "ipAddress": {
          "type": "Public",
          "ports": [
            {
              "protocol": "TCP",
              "port": 8000
            }
          ]
        }
      }
    }
  ]
}
```

## 🔧 Configuration Multi-Cloud

### 1. Variables d'Environnement par Environnement

```bash
# Production AWS
export VITE_API_URL=https://api.kidneyvision-aws.com
export DATABASE_URL=postgresql://user:pass@rds.amazonaws.com/kidneyvision
export STORAGE_BUCKET=s3://kidneyvision-uploads

# Production GCP
export VITE_API_URL=https://api.kidneyvision-gcp.com
export DATABASE_URL=postgresql://user:pass@sql.gcp.com/kidneyvision
export STORAGE_BUCKET=gs://kidneyvision-uploads

# Production Azure
export VITE_API_URL=https://api.kidneyvision-azure.com
export DATABASE_URL=postgresql://user:pass@azure.com/kidneyvision
export STORAGE_BUCKET=https://storage.azure.com/kidneyvision
```

### 2. CI/CD Multi-Cloud

```yaml
# .github/workflows/deploy.yml
name: Multi-Cloud Deployment

on:
  push:
    branches: [main]

jobs:
  deploy-aws:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to AWS
        run: |
          # Commandes de déploiement AWS
          
  deploy-gcp:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to GCP
        run: |
          # Commandes de déploiement GCP
          
  deploy-azure:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Azure
        run: |
          # Commandes de déploiement Azure
```

## 📊 Monitoring et Observabilité

### 1. AWS CloudWatch

```bash
# Créer des alarmes CloudWatch
aws cloudwatch put-metric-alarm \
  --alarm-name "KidneyVision-High-CPU" \
  --alarm-description "CPU utilization is high" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

### 2. GCP Cloud Monitoring

```bash
# Créer des politiques d'alerte
gcloud alpha monitoring policies create --policy-from-file=alert-policy.yaml
```

### 3. Azure Monitor

```bash
# Créer des règles d'alerte
az monitor metrics alert create \
  --name "High CPU Alert" \
  --resource-group kidneyvision-rg \
  --scopes /subscriptions/.../resourceGroups/kidneyvision-rg \
  --condition "avg Percentage CPU > 80" \
  --description "Alert when CPU is high"
```

## 🔐 Sécurité Cloud

### 1. Secrets Management

```bash
# AWS Secrets Manager
aws secretsmanager create-secret \
  --name kidneyvision/database/password \
  --secret-string "secure_password"

# GCP Secret Manager
echo "secure_password" | gcloud secrets create database-password --data-file=-

# Azure Key Vault
az keyvault secret set \
  --vault-name kidneyvision-vault \
  --name database-password \
  --value "secure_password"
```

### 2. Network Security

```bash
# Configurer les groupes de sécurité/pare-feu
# AWS Security Groups
aws ec2 create-security-group --group-name kidneyvision-sg --description "KidneyVision Security Group"

# GCP Firewall Rules
gcloud compute firewall-rules create kidneyvision-allow-http --allow tcp:80,tcp:443

# Azure Network Security Groups
az network nsg create --resource-group kidneyvision-rg --name kidneyvision-nsg
```

## 💰 Optimisation des Coûts

### 1. Stratégies d'Économie

```bash
# AWS - Utiliser Spot Instances
aws ec2 request-spot-instances --spot-price "0.05" --instance-count 1

# GCP - Utiliser Preemptible Instances
gcloud compute instances create kidneyvision-preemptible --preemptible

# Azure - Utiliser Spot VMs
az vm create --resource-group kidneyvision-rg --name kidneyvision-spot --priority Spot
```

### 2. Auto-scaling

```yaml
# Kubernetes Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: kidneyvision-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: kidneyvision-backend
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## 🚀 Déploiement Automatisé

### 1. Script de Déploiement Universel

```bash
#!/bin/bash
# deploy.sh

CLOUD_PROVIDER=${1:-aws}
ENVIRONMENT=${2:-production}

case $CLOUD_PROVIDER in
  aws)
    echo "Deploying to AWS..."
    aws configure set region us-east-1
    docker build -t kidneyvision-backend ./backend
    # Commandes AWS spécifiques
    ;;
  gcp)
    echo "Deploying to GCP..."
    gcloud config set project your-project-id
    gcloud builds submit --tag gcr.io/your-project-id/kidneyvision-backend ./backend
    # Commandes GCP spécifiques
    ;;
  azure)
    echo "Deploying to Azure..."
    az group create --name kidneyvision-rg --location eastus
    # Commandes Azure spécifiques
    ;;
  *)
    echo "Unsupported cloud provider: $CLOUD_PROVIDER"
    exit 1
    ;;
esac
```

### 2. Utilisation

```bash
# Déployer sur AWS
./deploy.sh aws production

# Déployer sur GCP
./deploy.sh gcp staging

# Déployer sur Azure
./deploy.sh azure development
```
