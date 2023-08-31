# command = f"ghz --insecure -n {requests} -c {workers} --connections {clients} --proto {proto_file} --call {proto_service} -d '{data}' {base_url} --output={output_file} --format=pretty --debug=./debug.txt"


## -n {requests} : number of requests

##  --connections {clients} : number of clients 

## -c {workers} : Number of workers to run concurrently (Each worker will get its share of the total number of request)

## --proto {proto_file} : protocol buffer file (compiled)

## --call {proto_service} : service file path (compiled)
