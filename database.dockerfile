# Start with Bitnami's official PostgreSQL base image
FROM bitnami/postgresql:17.0.0

# Set required environment variables (these can be overridden during runtime or Docker Compose setup)
ENV POSTGRESQL_USERNAME=dev \
    POSTGRESQL_PASSWORD=cs261isnotevenfun \
    POSTGRESQL_DATABASE=tupetition

# Expose the PostgreSQL port
EXPOSE 5431

# Add initialization scripts if you have any custom setup SQL files.
# Place any SQL or shell script in `/docker-entrypoint-initdb.d/`
# They will be automatically executed during the container's initialization.
COPY ./init-scripts/*.sql /docker-entrypoint-initdb.d/

# (Optional) If you need custom configuration, copy your custom PostgreSQL configuration file
# COPY ./my-postgresql.conf /opt/bitnami/postgresql/conf/postgresql.conf

# By default, Bitnami images use a non-root user for improved security
USER 1001

# Run the default entrypoint provided by Bitnami
ENTRYPOINT [ "/opt/bitnami/scripts/postgresql/entrypoint.sh" ]
CMD [ "/opt/bitnami/scripts/postgresql/run.sh" ]
