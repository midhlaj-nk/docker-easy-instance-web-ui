#!/bin/bash
# Update Kubernetes deployment to add ODOO_BACKEND_URL environment variable

kubectl patch deployment easyinstance-frontend -n easyinstance --type='json' -p='
[
  {
    "op": "add",
    "path": "/spec/template/spec/containers/0/env/-",
    "value": {
      "name": "ODOO_BACKEND_URL",
      "value": "http://web.easyinstance.com"
    }
  }
]'

echo "Deployment updated. Restarting pods..."
kubectl rollout restart deployment/easyinstance-frontend -n easyinstance
kubectl rollout status deployment/easyinstance-frontend -n easyinstance

