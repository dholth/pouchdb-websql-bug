#!/usr/bin/env python
# Minimum required test data for bug

import glob
import json

docsdocs = []

for filename in glob.glob("dump2*20.txt") + glob.glob("dump3*.txt"):
    for line in open(filename, 'r'):
        data = json.loads(line)
        if not 'docs' in data: continue
        data['docs'] = [doc for doc in data['docs'] if doc['_id'] == 'b74e3b45']
        if not data['docs']: continue
        docsdocs.append(data)

print json.dumps(docsdocs, indent=True)
