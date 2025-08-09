# Fullstack Todo Application - Kubernetes Deployment on AWS EKS with ArgoCD and ALB

This repository contains a **full end-to-end deployment** of a Todo application with:

- **Frontend:** React + Vite  
- **Backend:** Express.js with Prisma ORM  
- **Database:** MySQL  
- **Containerization:** Docker (frontend, backend, and database)  
- **Kubernetes Deployment:** Deployed on Amazon EKS cluster  
- **Ingress:** Exposed via AWS Application Load Balancer (ALB) using ALB Ingress Controller  
- **GitOps:** Automated deployments with ArgoCD  

---

## Table of Contents

- [Architecture Overview](#architecture-overview)  
- [Prerequisites](#prerequisites)  
- [Setup and Deployment](#setup-and-deployment)  
  - [1. Create EKS Cluster](#1-create-eks-cluster)  
  - [2. Setup IAM OIDC Provider and Permissions](#2-setup-iam-oidc-provider-and-permissions)  
  - [3. Install ALB Ingress Controller](#3-install-alb-ingress-controller)  
  - [4. Build and Push Docker Images](#4-build-and-push-docker-images)  
  - [5. Deploy MySQL Database](#5-deploy-mysql-database)  
  - [6. Deploy Backend and Frontend Services](#6-deploy-backend-and-frontend-services)  
  - [7. Setup ArgoCD for GitOps](#7-setup-argocd-for-gitops)  
  - [8. Access the Application](#8-access-the-application)  
- [Repository Structure](#repository-structure)  
- [Useful Commands](#useful-commands)  
- [Troubleshooting](#troubleshooting)  
- [Contact](#contact)

---

## Architecture Overview


---

## Prerequisites

- AWS Account with admin permissions  
- `eksctl`, `kubectl`, `awscli`, and `helm` installed locally  
- Docker installed and running  
- GitHub repository (this repo) with your source code and manifests  
- Docker Hub or ECR account for container image storage  
- AWS CLI configured (`aws configure`) with proper IAM permissions  
- ArgoCD CLI (optional but recommended)

---

## Setup and Deployment

### 1. Create EKS Cluster

Use `eksctl` to create the cluster:

```bash
eksctl create cluster \
  --name fullstack-todo-app \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 2 \
  --nodes-max 4 \
  --managed
```

## 2. Setup IAM OIDC Provider and Permissions
Enable OIDC for your cluster (required for ALB Ingress Controller):
```
eksctl utils associate-iam-oidc-provider --region us-east-1 --cluster <cluster_name> --approve
```
## Create IAM Policy for ALB Controller
```
curl -o iam-policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.13.3/docs/install/iam_policy.json

aws iam create-policy \
  --policy-name AWSLoadBalancerControllerIAMPolicy \
  --policy-document file://iam-policy.json
```

## Create IAM Service Account (IRSA)
```
eksctl create iamserviceaccount \
  --cluster <CLUSTER_NAME> \
  --region <AWS_REGION> \
  --namespace kube-system \
  --name aws-load-balancer-controller \
  --attach-policy-arn arn:aws:iam::<AWS_ACCOUNT_ID>:policy/AWSLoadBalancerControllerIAMPolicy \
  --approve
```

## Install cert-manager (required for webhooks)
```
kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v1.13.5/cert-manager.yaml
```

## Download and Modify Controller Manifest (v2.13.3)
```
curl -Lo v2_13_3_full.yaml https://github.com/kubernetes-sigs/aws-load-balancer-controller/releases/download/v2.13.3/v2_13_3_full.yaml
```

## Remove the ServiceAccount block (since you created it with eksctl):
## Delete lines 690–698 (or search for and remove this block):
```
apiVersion: v1
kind: ServiceAccount
metadata:
  labels:
    app.kubernetes.io/name: aws-load-balancer-controller
  name: aws-load-balancer-controller
  namespace: kube-system
```



