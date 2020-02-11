let a = 10

// Conditionals

if (a < 5)
    console.log(a-5)
else if(a == 10) /// === checks for equality in data type
    console.log(a*10)
else
    console.log(a)


// Loops

for (let i = 1, j = 11; i < 10 && j > 0 ; i++, j--) {
    console.log(i,j)
}       

let d = 0
while (d < 4)
{
    console.log(d)
    d++
}

// Lists

let list = []
list.push(4,6,3,5,"string") // Any data type. Everything is an object, similar to Python
console.log(list,list[4])

list.reverse() // it's destructive, like '!' in Ruby 
console.log(list)

// Function declaration
function suma5 (element){
    console.log(element + 5)
}

// For each element
list.forEach(suma5)

for (element of list){
    console.log(element)
}

console.log('---------------')

for(element in list){ // IN retuns the index of the element in the list 
    console.log(element)
}

// Lambda functions / anonym functions
list = [4,6,3,5]


list.sort((x,y) => x - y)

