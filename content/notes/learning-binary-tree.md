---
title: Learning Binary Trees
date: 2023-09-06
draft: false
tags:
    - learning
    - algosAndDS
---

> [!warning] WIP
>
> These notes are a work in progress, and will updated as refine my knowledge

Trees in general are node-based data structure like linked lists. Unlike singly-linked or even doubly-linked lists any one 
node can point to many other nodes. These nodes are considered this nodes children and this node is the "parent" of those
nodes. The root node is called...the root node. Here is a picture of what one looks like. 

![binary tree sketch](/notes/static/tree-example.png)

So what about a binary search tree? Well a binary search tree just a tree with two more restritctions:

1. **Binary** - each node can only have at most a left and right child
2. **Search** - the left node must be less then the parent node and right node must be greater than

So lets start by building one of these out. I will do this in python and C.

```python
class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

    def __repr__(self):
        return f"<TreeNode: {self.val}>"

```

I can use this with 

```python
l_node = TreeNode(10)
r_node = TreeNode(20)
root = TreeNode(15, l_node, r_node)
# tree:
#        15 
#      /    \
#    10     20
#  /   \   /  \
# 4    7  17   25
```

In C, I think this is easier

```c
typedef struct IntBTNode {
    int               value;
    struct IntBTNode *left;
    struct IntBTNode *right;
} IntBTNode;
```

I can write some helper function for creating a new one 

```c
IntBTNode *new_bt_node(int value) {
    IntBTNode *n = malloc(sizeof(IntBTNode));
    n->left = NULL;
    n->right = NULL;
    n->value = value;

    return (n);
}
```

and I can use it with

```c
IntBinaryNode *root_node = new_BT_node(15);
root_node->left = new_BT_node(10);
root_node->right = new_BT_node(20);
```

The biggest difference between the two here is that the python version will let me fill 
in the tree with whatever I want, which is not good. The following is fine in python

```python
TreeNode("a", TreeNode(12), TreeNode(.4))
```

Ok so we got the basic element of a tree written out, the node. Let's create a basic binary
search tree and start operating on it. 

## Create Tree

Let's create the following tree in the both version of our tree.

```
# tree:
#        15 
#      /    \
#    10     20
#  /   \   /  \
# 4    7  17   25
```

in python:

```python
tree = TreeNode(
    15,
    left=TreeNode(10, left=TreeNode(4), right=TreeNode(7)),
    right=TreeNode(20, left=TreeNode(17), right=TreeNode(25)),
)
```

I guess it would be nice to define a dictionary and be able to call `tree_from_dict` or something. Well
I'll try and get to that at the end.

in C, I will create a `main` I will adding to:

```c
int main(void) {
    IntBTNode *root_node = new_BT_node(12);
    root_node->left = new_BT_node(10);
    root_node->right = new_BT_node(20);

    root_node->left->left = new_BT_node(4);
    root_node->left->right = new_BT_node(7);

    root_node->right->left = new_BT_node(17);
    root_node->right->right = new_BT_node(25);

    return (0);
}
```


