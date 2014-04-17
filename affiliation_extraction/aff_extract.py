import json
import re
from pprint import pprint
obj=open('papers.txt','r') #load the paper.txt file which contains the downloaded papers info
#j=json.loads('{"one" : "1", "two" : "2", "three" : "3"}')
j=json.loads(obj.read())
counter=0
print len(j) #j is a list
for i in range(0,len(j)):
	paper_id=j[i]['paper_id']
	author_list = j[i]['paper_authors']
	#print "author list", author_list 
	for k in range(0,len(author_list)):
		work_str=j[i]['paper_authors'][k]['affiliation']
		work_str_list=work_str.split(",")
		#print work_str_list
		

		for s in work_str_list:
			if s.find("Univ")!=-1 or s.find("univ")!=-1 or s.find("Insti")!=-1 or s.find("insti")!=-1 :
				print paper_id,"  ",s.strip()
				counter+=1
			else :
				sobj=re.search(r'[\w.-]+@[\w.-]+', s)
				if  sobj:
					print s[:sobj.start()]
			

#print j['paper_authors']['affiliations']
#or s.find("insti") or s.find("Univ")
print counter