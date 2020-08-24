CREATE KEYSPACE stuff WITH replication = {'class': 'NetworkTopologyStrategy', 'caas-dc': '1'}  AND durable_writes = true;

CREATE TABLE stuff.usage_log (
    user_id text,
    year int,
    month int,
    active_device text,
    active_at timestamp,
    activity_description text,
    activity_location text,
    PRIMARY KEY ((user_id, year, month), active_at)
);

CREATE TABLE stuff.user_devices (
    user_id text,
    device_name text,
    description text,
    device_location text,
    last_used timestamp,
    most_recent_device text static,
    PRIMARY KEY (user_id, device_name)
);

CREATE TABLE stuff.users (
    user_id text PRIMARY KEY,
    city text,
    email text,
    last_login timestamp,
    member_since timestamp,
    name text
);
