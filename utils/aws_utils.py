import sys
import pandas as pd
import json

print ("Hello form Python")

print('First param:'+sys.argv[1]+'#')
print('Second param:'+sys.argv[2]+'#')

def read_user(user):
    with open(user,) as f:
        data = json.load(f)

    # Output: {'key_id': , "secret_key" : , "region_name" : }
    print(data)
    return data

def s3_conn(key_id, secret_key, regional_name):
    # get a handle on s3
    session = boto3.Session(
                    aws_access_key_id= key_id,
                    aws_secret_access_key=secret_key,
                    region_name=regional_name)
    
    s3 = session.resource('s3')

    return s3

data = read_user('../data/cre.json')
s3 = aws_utils.s3_conn(data['key_id'], data['secret_key'], data['region_name'])