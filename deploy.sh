npm run build &&
aws s3 cp build s3://receipt-split --recursive
