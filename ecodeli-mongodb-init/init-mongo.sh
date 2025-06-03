set -e

sleep 10

DB_NAME="objectif20"

cd /docker-entrypoint-initdb.d/dump

for file in *.bson; do
    if [ -f "$file" ]; then
        collection_name=$(basename "$file" .bson)
        mongorestore --db "$DB_NAME" --collection "$collection_name" "$file"
    fi
done
