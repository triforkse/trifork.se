all: run

db:
	docker run --name triforkse_db -e POSTGRES_PASSWORD=$TRIFORKSE_PASSWORD -d postgres

db-console:
	docker exec -it triforkse_db 'exec psql -h "$POSTGRES_PORT_5432_TCP_ADDR" -p "$POSTGRES_PORT_5432_TCP_PORT" -U postgres'

run:
	nodemon app.js

test:
	gulp test


.PHONY: run test
