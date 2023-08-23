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