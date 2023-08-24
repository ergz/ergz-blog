---
title: Learning Hash Tables
date: 2023-08-22
tags:
    - learning
---

> [!warning] WIP
>
> These notes are a work in progress, and will updated as refine my knowledge

A hash table is a data structure that allows you to lookup values based on a key:value association. So given 
I want to store the key:value "hello":"world", I would hash the word "hello" by applying a transformation that would convert it 
to a value that I can use as an index, at this index position I would store the "world" associated value. 
Using this approach lets use lookups values in $O(1)$.

In math notation I suppose I can write it as:

$$f(x) \rightarrow \mathbb{Z+}$$

where $f$ is the hashing function and $x$ is what I want to hash.

## Example

Lets build this example out, I want to store key value pairs of opposite words, for example "hello":"goodbye". To do this I need create
a function that maps the key (in this case "hello") to the positive integers. It also makes sense to map it to a restricted set
of unsigned integers since I do not have unlimited memory on a computer.

The hashing function I use will simply look at each letter of the key, get the index of each letter in the alphabet
and multiply these. The resulting product will be the index we will store the **value** in. In essence this is
a hashing function, its a crappy one but it satisfies $f(x) \rightarrow \mathbb{Z+}$. Why is it crappy? Well
if I try to store the key: "olleh", it would map it the same index that the key "hello" was mapped to.
This is known as a **collision**. I will restrict the number of possible indices to just 16 by taking the modulo
16 of the result of the product.

Here I implement this basic hash function in Python

```python
import string

alphabet = [i for i in string.ascii_lowercase]

def get_alpha_index(val, arr):
    for i, letter in enumerate(arr):
        if val == letter:
            return i + 1

    return None

def hash(word):
    split_word = [i for i in word]
    split_prods = [linear_search(i, alphabet) for i in split_word]
    hash_key = 1
    for i in split_prods:
        hash_key *= i

    return hash_key % 16
```

Lets test this out


```bash
>>> hash("hello")
0
```
|Letter| Index |
|-----|----|
|h | 8 |
|e | 5 |
|l | 12 |
|l | 12 |
|o | 15 |

$$ 8 * 5 * 12 * 12 * 15 = 86400$$

$$ 86400 \mod 16  = 0$$

so therefore we place the value "goodbye" in the zero index.

To fisnish the data structure I just need a function that places
the value in the correct index. We also implement a delete and get 
method.

```python
def insert_kv(key, value, container):
    key_hash = hash(key)
    container[key_hash] = value

def get_at_key(key, container):
    key_hash = hash(key)
    return container[key_hash]

def delete_at_key(key, container):
    key_hash = hash(key)
    container[key_hash] = None
```

Lets try implementing this in C

First lets just translate the hash funcion.

```c
#include <string.h>

int get_index_for_letter(char letter) {
    if (letter >= 'a' && letter <= 'z') {
        return (letter - 'a') + 1;
    } else {
        return -1;
    }
}

int hash(char *word) {
    int word_len = strlen(word);
    int accum = 1;
    int index;
    for (int i = 0; i < word_len; i++) {
        index = get_index_for_letter(word[i]);
        accum *= index;
    }

    return accum % 16;
}
```

``` 
> hash-table.exe
the hash value of the word is 0
```

So far so good, there are many parts of the C code that can be improved, but I will 
tackle that later on in a different section.

The insert part for now will be very basic

```c
int main() {
    char word[] = "hello";
    int  hash_val = hash(word);

    printf("the hash value of the word is %d\n", hash_val);

    char *hash_table[16];
    for (int i = 0; i < 16; i++) {
        hash_table[i] = NULL;
    }

    hash_table[hash_val] = "world";

    return 0;
}

```

We can also add `get` function to retrieve a value given a key

```c
char *get_key(char *hash_table[], char *key) {
    int hash_val = hash(key);
    return hash_table[hash_val];
}
```

main now looks like:

```c
int main() {
    char word[] = "hello";
    int  hash_val = hash(word);

    printf("the hash value of the word is %d\n", hash_val);

    char *hash_table[16];
    for (int i = 0; i < 16; i++) {
        hash_table[i] = NULL;
    }

    hash_table[hash_val] = "world";
    char *value = get_key(hash_table, word);

    printf("the value at key '%s' is '%s'", word, value);

    return 0;
}
```

```
> hash-table.exe
the hash value of the word is 0
the value at key 'hello' is 'world'
```