ans = []

with open('inp.txt', 'r') as file:
    for line in file:
        pair = line.strip().split()

        ans.append([int(i) for i in pair])


with open('out.txt', 'w') as file:
    file.write(str(ans))
