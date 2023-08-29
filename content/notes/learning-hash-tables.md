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

Lets add a bit more structure to the hash table, by creating a struct to store the hash table strucutre.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct HashTable {
    char *data[16];
} HashTable;

HashTable *new_hashtable() {
    HashTable *ht = malloc(sizeof(HashTable));
    for (int i = 0; i < 16; i++) {
        ht->data[i] = NULL;
    }

    return (ht);
}

```

and some new function as well as the updated main.


```c

char *get(HashTable *h, char *key) {
    int hash_val = hash(key);
    return h->data[hash_val];
}

void insert(HashTable *h, char *key, char *value) {
    int hashed_key = hash(key);
    h->data[hashed_key] = value;
}

void delete(HashTable *h, char *key) {
    int hashed_key = hash(key);
    h->data[hashed_key] = NULL;
}

int main() {
    HashTable *hash_table = new_hashtable();
    char      *key = "hello";
    insert(hash_table, key, "world");
    char *res = get(hash_table, "hello");

    printf("the value at key '%s' is '%s'", key, res);

    return 0;
}

```

Now we try and deal with collisions. So what are colissions? Colissions are simply when a 
key gets hashe to the same index that another key was hashed to. For example hashing "bad", and
"dab" with my hash would be a collision. One of the way that these are resolved is by creating 
a sub array within the hash table to store more than one value per hash.

One way to resolve this:

```c
void insert(HashTable *h, char *key, char *value) {
    int hashed_key = hash(key);

    if (h->data[hashed_key] != NULL) {
        fprintf(stderr, "ERROR: collision!");
        exit(1);
    }

    h->data[hashed_key] = value;
}

```

LOL but that is bad.

## Improve the hash table

So far I have only been storing the values, lets storing the key and values together.


```c
#define MAX_HASH_TABLE_SIZE 16

typedef struct KV {
    char *key;
    char *value;
} KV;

typedef struct HashTable {
    KV data[MAX_HASH_TABLE_SIZE];
} HashTable;

HashTable *new_hashtable() {
    HashTable *ht = malloc(sizeof(HashTable));
    for (int i = 0; i < MAX_HASH_TABLE_SIZE; i++) {
        ht->data[i].key = NULL;
        ht->data[i].value = NULL;
    }

    return (ht);
}

```

I will continue using this simple hashing function for now.

I need find a way to determine if a key is in the hash table I will implement 
a linear search for this. Here a very basic linear search that uses `strcmp` 
to check if the a key exist in the hash table.


```c
KV *find_KV_in_ht(HashTable h, char *key) {
    for (size_t i = 0; i < MAX_HASH_TABLE_SIZE; i++) {
        if ((h.data[i].key != NULL) && (strcmp(h.data[i].key, key) == 0)) {
            return (&h.data[i]);
        }
    }

    return (NULL);
}
```

and here is a very basic main to test it out

```c
int main() {

    HashTable *h = new_hashtable();

    // test leaving 0 index NULL
    h->data[1].key = "hello";
    h->data[1].value = "world";

    KV *kv = find_KV_in_ht(*h, "hello");
    printf("the value corresponding to the key 'hello' is: %s", kv->value);

    return 0;
}

```

### Functions to add, remove and retrieve

The first one we can tackle is the retrieve one, since we already developed
the linear search, we can just use that here:

```c
char *get_value(HashTable ht, char *key) {
    KV *kv = find_KV_in_ht(ht, key);

    return kv->value;
}
```

This essentially a wrapper to find_kv but it returns the `char*` of the value itself.

Here is the insert:

```c
void insert_kv(HashTable *ht, char *key, char *value) {
    KV *kv = find_KV_in_ht(*ht, key);

    if (kv == NULL) {
        int hash_val = hash(key);
        if (ht->data[hash_val].key != NULL) {  // value with has exists
            // come up with clever way to resolve the collision
        } else {
            ht->data[hash_val].key = key;
            ht->data[hash_val].value = value;
        }
    } else {
        printf("key already in HashTable\n");
    }
}

```

Ok lets think of ways to resolve this collision, the book I am reading for this suggets a naive
solution which is when this happens have this index point a "sub-array" with key value pairs
for this hash. The book relies heavily on scripting languages, so I gotta think a bit of how
to best do this in C.

So in order to this new approach I need rewrite the way I am doing the hashtable structure, the
structures now look like this:

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_HASH_TABLE_SIZE 16

typedef struct KV {
    char *key;
    char *value;
} KV;

typedef struct Node {
    KV           kv;
    struct Node *next;
} Node;

typedef struct HashTable {
    Node *data[MAX_HASH_TABLE_SIZE];
} HashTable;

HashTable *new_hashtable() {
    HashTable *ht = malloc(sizeof(HashTable));
    for (int i = 0; i < MAX_HASH_TABLE_SIZE; i++) {
        ht->data[i] = NULL;
    }

    return (ht);
}
```

Basically what's going to happen is, at the very basic usage each element of
data in the hastable will just have a single Node with a KV, however in the
case of a collision the first node will point to second node that stores
the other kv that got mapped to this same hash. The `node --> node` approach 
is a linked list.

We need to update the other functions, here is the updated version of the `insert`.

```c
void insert_kv(HashTable *ht, char *key, char *value) {
    int hashed_key = hash(key);

    Node *current = ht->data[hashed_key];

    while (current) {
        if (strcmp(current->kv.key, key) == 0) {
            current->kv.value = value;
            return;
        }

        current = current->next;
    }

    Node *new = new_node();
    new->kv.key = key;
    new->kv.value = value;
    new->next = current;
    ht->data[hashed_key] = new;
}
```

what we do here is get the current value at the hashed key, this can be `NULL`
and will be the case when we are inserting at this hash for the first time. Wen this 
is not null we step into the while loop iterating through all values in the linked list
starting the current node. If we find the same key we are trying to insert we update, otherwise
the key is new. At this point we create a new node that we will preppend to the link list. 
If this is the first item in the hash then it will be the first (and only) node at the 
hash index. 

The updated `get` function is here, I do it in two functions, since I will need the `get_node` 
function for some other operations as well.

```c
Node *get_node(HashTable ht, char *key) {
    int hash_key = hash(key);

    Node *node_at_hash = ht.data[hash_key];

    if (node_at_hash == NULL) {
        fprintf(stderr, "ERROR: key not found in hashtable");
        return (NULL);
    }

    while (node_at_hash) {
        if (strcmp(node_at_hash->kv.key, key) == 0) {
            return (node_at_hash);
        }

        node_at_hash = node_at_hash->next;
    }

    return (NULL);
}

char *get_value(HashTable ht, char *key) {
    Node *node = get_node(ht, key);

    if (node) {
        return (node->kv.value);

    } else {
        return (NULL);
    }
}
```

Updated `delete`. For the delete I need to be more careful since simply removing a node
can potentially leave `next` nodes dangling with no link back to the hashtable. In order to 
make this work I will update the `Node` struct to point to the previous node as well (doubly-linked list(?)).

```c
typedef struct Node {
    KV           kv;
    struct Node *next;
    struct Node *prev;  // to make deleteing a key easier
} Node;
```

and `delete_key`

```c {8}
void delete_key(HashTable *ht, char *key) {
    Node *node = get_node(*ht, key);

    if (node->prev) {                   // if node is not first
        node->prev->next = node->next;  // skip over node to delete
        free(node);
    } else {  // if node is first
        ht->data[hash(key)] = node->next;
        free(node);
    }

    return;
}
```

what I do here is first check if the node is the first in the linked list, if it is, 
then I just assign the `data` value of the hashtable to be the `next` of the node to 
delete, this may be `NULL` but that is fine. If the node to remove is not the first I simply
skip over it by pointing around it, in both cases I `free` the node. Line 8 (highlighted)
seems like its doing duplicate work, since I am already getting the hash of the key in the
`get_node` function, but I wont worry about this for now.

Here is my main function for testing so far.

```c
int main() {
    HashTable *h = new_hashtable();

    insert_kv(h, "hello", "there");
    char *key = "hello";
    char *result = get_value(*h, key);
    printf("the value corresponding to the key 'hello' is: '%s'\n", result);
    delete_key(h, key);
    char *new_result = get_value(*h, key);
    printf("the value corresponding to the key 'hello' is: '%s'\n", new_result);

    return 0;
}
```

```
> hash-table.exe 
the value corresponding to the key 'hello' is: 'there'
ERROR: key not found in hashtable
the value corresponding to the key 'hello' is: '(null)'
```