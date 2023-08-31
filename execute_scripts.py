import sys
import json


def append_to_file(filename, text):
    with open(filename, 'a') as file:
        file.write(text + '\n')


def readJSONFile(fileName):
    try:
        with open(fileName, 'r') as json_file:
            json_data = json.load(json_file)
            return json_data
    except FileNotFoundError:
        print(f"File Not Found {fileName}")
    except Exception as e:
        print(f"An error occurred readFile: {e}")
    return None


def executeCommand(data, base_url, commands_file):
    try:
        requests = data['number_of_request']
        workers = 1000
        if 'workers' in data:
            workers = data['workers']

        clients = data['clients']
        data_file = data['data_file_path']
        proto_file = data['proto_file']
        proto_service = data['proto_service']
        output_file = f'./output/logs/output_client_{clients}_{requests}.json'

        file_data = {}
        with open(data_file, 'r') as json_file:
            file_data = json.load(json_file)
        filename = f'output_server_{workers}_{requests}.json'
        # file
        data = json.dumps({
            **file_data,
            "filename": filename
        })

        command = f"ghz --insecure -n {requests} -c {workers} --connections {clients} --proto {proto_file} --call {proto_service} -d '{data}' {base_url} --output={output_file} --format=pretty --debug=./debug.txt"

        append_to_file(commands_file, command)
    except Exception as e:
        print(f"An error occurred readFile: {e}")


def main(fileName, output_file):
    try:
        data = readJSONFile(fileName)

        if data:
            for value in data['request_data']:
                executeCommand(
                    value, base_url=data['base_url'], commands_file=output_file)
        else:
            print(
                f'Something went wrong with readJSONFile, data received : {data}')
    except Exception as e:
        print(f"Error occurred main: {e}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python execute_script.py <JSON File Path> <Command Output Text File>")
    else:
        arg1 = sys.argv[1]
        arg2 = sys.argv[2]
        main(arg1, arg2)
