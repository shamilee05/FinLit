import sys 
# Takes first name and last name via command  
# line arguments and then display them 

#------------------------

test = open('user_classifer.csv','r')

index = test.readline() 
index = index.strip().split(',')
class_no = len(index)
total = 0

data_set = []
for line in test:
  trans = line.strip().split(',')
  if trans is not(index):
    data_set.append(trans)
    total = total + 1

enter = index
index.pop()
test_set = []
for i in range(1, class_no):
  test_set.append(sys.argv[i])

classifiers = []
#n = int(input("Enter the no. of classifiers for the main class: "))
n = 3
#for i in range(0, n):
#  classifiers.append(input("Enter classifier name: "))
classifiers.append('b')
classifiers.append('i')
classifiers.append('e')

classifiers_probability = []
conditional_probability = []
count_total = []
total_probability = []

#simple probability

for char in classifiers:
  count = 0
  for item in data_set:
    if item[class_no-1] == char:
      #print(item)
      count = count + 1
  classifiers_probability.append(count/total)
  count_total.append(count)


#conditional probability
for char in classifiers:
  prob = []
  for i in range(0, class_no-1):
    count = 0
    for item in data_set:
      if item[class_no-1] == char and item[i] == test_set[i]:
        #print(item)
        count = count + 1
    prob.append(count)
  conditional_probability.append(prob)


for i in range(0, n):
  for j in range(0, class_no-1):
    conditional_probability[i][j] = conditional_probability[i][j]/count_total[i]


for i in range(0, n):
  total_prob = 1
  for j in range(0, class_no-1):
    total_prob = total_prob * conditional_probability[i][j]
  total_prob = total_prob * classifiers_probability[i]
  total_probability.append(total_prob)
  #print("P(X|C) * P(C) = " + str(total_prob)+ " for classifier "+ classifiers[i])

max_val = max(total_probability)
ind = total_probability.index(max_val)

print(classifiers[ind])
sys.stdout.flush()