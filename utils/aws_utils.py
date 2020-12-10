import sys
import pandas as pd
import json
import boto3
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from io import BytesIO

print ("Hello form Python aws_utils")

#print('First param:'+sys.argv[1]+'#')
#print('Second param:'+sys.argv[2]+'#')

def s3_conn(key_id, secret_key, regional_name):
    # get a handle on s3
    session = boto3.Session(
                    aws_access_key_id= key_id,
                    aws_secret_access_key=secret_key,
                    region_name=regional_name)
    
    s3 = session.resource('s3')

    return s3

def upload_pic(s3, bucket_name, file_name):
    # get a handle on the bucket that holds your file
    bucket = s3.Bucket(bucket_name) # example: energy_market_procesing
    
    print(bucket)
    
    #upload files to S3 bucket
    bucket.upload_file(file_name, Key='Iris.csv')
    
def read_pic (s3,bucket_name, file_name):    
    # Get image from S3 bucket
    bucket = s3.Bucket(bucket_name)
    obj = bucket.Object(file_name)
    print (obj)
    
    file_stream = obj.get()['Body']
    
    img = mpimg.imread(BytesIO(file_stream.read()))
    # imgplot = plt.imshow(img)
    # plt.show(imgplot)

    return img
