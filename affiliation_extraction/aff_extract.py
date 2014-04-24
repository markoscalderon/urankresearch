import json
import re
from pprint import pprint
obj=open('papers.json','r') #load the paper.txt file which contains the downloaded papers info
#j=json.loads('{"one" : "1", "two" : "2", "three" : "3"}')
j=json.loads(obj.read())
counter=0
country_list=["Australia.","Austria.","Belgium.","Brazil.","Canada.","Chile.","China.","Colombia.","Costa Rica.","Croatia.","Cyprus.","Czech.","Denmark.","Egypt.","Estonia.","Finland.","France.","Germany.","Greece.","Hong Kong.","Hungary.","Iceland.","India.","Iran.","Ireland.","Israel.","Italy.","Japan.","Jordan.","Lebanon.","Lithuania.","Macau.","Malaysia.","Mexico.","Netherlands.","New Zealand.","Norway.","Pakistan.","Peru.","Poland.","Portugal.","Romania.","Russia.","Saudi Arabia.","Serbia.","Singapore.","Slovakia.","Slovenia.","South Africa.","South Korea.","Spain.","Sweden.","Switzerland.","Taiwan.","Thailand.","Turkey.","United Kingdom.","UK.","United States.","Venezuela.","Vietnam."]
print len(j) #j is a list
prev_str=""
fo = open("paper_aff_data_cleaned.csv", "wb")
for i in range(0,len(j)):
	paper_id=j[i]['paper_id']
	author_list = j[i]['paper_authors']
	#print "author list", author_list 
	for k in range(0,len(author_list)):
		work_str=j[i]['paper_authors'][k]['affiliation']
		work_str_list=work_str.split(",")
		#print work_str_list
		
		temp_string=paper_id
		hasboth=0
		univhascome=0
		temp_work_string="" #string that will contain the affiliation of the author
		for s in work_str_list:
			s.strip()
			if (s.find("Univ")!=-1 or s.find("univ")!=-1) and (s.find("Depart")!=-1 or s.find("depart")!=-1) and hasboth!=1 :
				hasboth=1;
				temp_work_string=temp_work_string+"$"+s
				
			if (s.find("Univ")!=-1 or s.find("univ")!=-1 or s.find("Insti")!=-1 or s.find("insti")!=-1 or s.find("pol")!=-1 or s.find("Pol")!=-1) and (s.find("Depart")==-1 or s.find("depart")==-1) and univhascome==0:
				temp_work_string="$"+s
				univhascome=1;
			#print paper_id,"  ",s.strip()
			
			sobj=re.search(r'[\w.-]+@[\w.-]+', s)
			if  sobj:
				#print s[:sobj.start()]+"Author name "+ j[i]['paper_authors'][k]['name']
				temp_work_string=temp_work_string+"$"+s[:sobj.start()].strip()				
			
			else:
				if s.find("USA")!=-1:
					temp_work_string=temp_work_string+"$United States of America"
			if work_str_list.index(s)==len(work_str_list)-1 :
				findcountry=s.split(" ")
				for eachtoken in findcountry:
					if eachtoken in country_list:
						temp_work_string=temp_work_string+"$"+eachtoken.strip()
		
		
		if temp_work_string.find("USA")!=-1 or temp_work_string.find("USA.")!=-1 :
			temp_work_string=temp_work_string.replace("USA","United States")
			
		if temp_work_string.find("UK")!=-1 or temp_work_string.find("UK.")!=-1 :			
			temp_work_string=temp_work_string.replace("UK","United Kingdom")
			
		sobj=re.search(r'[\w.-]+@[\w.-]+', temp_work_string)
		if sobj:
			temp=temp_work_string
			temp_work_string=temp_work_string[:sobj.start()]+temp_work_string[sobj.end():]
		temp_string=temp_string+temp_work_string
	if len(temp_string)!=0 :
		if temp_string!=prev_str and len(temp_string)>8:
			print temp_string
			fo.write(temp_string.encode('utf-8'))
			fo.write("\n")
	prev=temp_string
	counter=counter+1

#print j['paper_authors']['affiliations']
#or s.find("insti") or s.find("Univ")
print counter
fo.close()