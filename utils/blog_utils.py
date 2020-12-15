import sys
import pandas as pd
import json
import aws_utils
import pathlib
#print ("Hello form Python blog_utils")
#print (pathlib.Path().absolute())
#print('First param:'+sys.argv[1]+'#')
#print('Second param:'+sys.argv[2]+'#')

def read_user(user):
    with open(user,) as f:
        data = json.load(f)

    # Output: {'Access_ID': , "Secret" : , "Region_name" : }
    print(data)
    return data

def load_pic():
    data = read_user('./data/cre.json')
    s3 = aws_utils.s3_conn(data['Access_ID'], data['Secret'], data['Region_name'])
    file_name = sys.argv[1]
    
    bucket_name = 'new-test-1'
    #aws_utils.upload_dataset(s3, bucket_name, file_name)
    #aws_utils.new_all(s3, 'new-test-1', file_name, region_name)
    
    read_file = aws_utils.read_pic(s3, bucket_name, file_name)
    
    return read_file
    # link_column is the column that I want to add a button to
    #return render_template("simple.html", column_names=file.columns.values, 
    #                       row_data=list(file.values.tolist()), zip=zip)

test = load_pic()
print (test)