### Aikata Main DB Backup (Directus)

SET CLUSTER SETTING cloudstorage.s3.buffer_and_put_uploads.enabled = true;
SET CLUSTER SETTING bulkio.backup.file_size = '32MiB';
BACKUP DATABASE "aikata-directus" INTO 's3://aikata-backup/aikata-directus?AWS_ENDPOINT=s3.us-east-005.backblazeb2.com&AWS_REGION=us-east-005&AWS_USE_PATH_STYLE=true&AWS_SKIP_CHECKSUM=true&AWS_ACCESS_KEY_ID=005597c91808dcb0000000002&AWS_SECRET_ACCESS_KEY=K005IU+9lymhilp86H5RQr01CNXTaQw&AWS_SKIP_CHECKSUM=true' AS OF SYSTEM TIME '-10s';


RESTORE DATABASE "aikata-directus" FROM LATEST IN 's3://aikata-backup/aikata-directus?AWS_ENDPOINT=s3.us-east-005.backblazeb2.com&AWS_REGION=us-east-005&AWS_USE_PATH_STYLE=true&AWS_SKIP_CHECKSUM=true&AWS_ACCESS_KEY_ID=005597c91808dcb0000000002&AWS_SECRET_ACCESS_KEY=K005IU+9lymhilp86H5RQr01CNXTaQw&AWS_SKIP_CHECKSUM=true' WITH new_db_name = 'aikata-directus-dev';