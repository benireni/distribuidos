## To Install Python Dependencies

### Download PIP3 Dependencies
sudo apt-get install python-virtualenv
python3 -m venv .distribuidos-venv
pip install -r requirements.txt

### Start Prometheus
./prometheus-2.53.0.linux-amd64/prometheus

### Start MongoDB
sudo systemctl start mongod

### Load up MongoDB
mongosh < /home/gsdgrad22/source/scripts/load_mongodb.js

### Start Kafka Zookeeper (keep it running in a terminal)
./bin/zookeeper-server-start.sh config/zookeeper.properties

### Start Kafka Broker (keep it running in another terminal)
./bin/zookeeper-server-start.sh config/server.properties

### Create our topic (run this in a third terminal)
./bin/kafka-topics.sh --create --topic medication-request --bootstrap-server localhost:9092
