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

## Traversing 

One of the basic things we can do with a tree is do traversing. There are two ways we can traverse
these trees, breadth first or depth first search. The difference between the two is basically:

* **Breadth First** we traverse the tree level by level, so we visit each node at each level before we proceed to the next one
* **Depth First** we traverse by going down a "branch" and visiting each node along the way.

Traversing is a kind of search although somewhat useless since we have a binary tree, as we will see we can make use of this property
to easily find whether a given value is in the tree or not.

### Depth First Search

```python
output = []

def dfs_pre_order(node, container=[]):
    if node.left is None and node.right is None:
        container.append(node.val)
    else:
        container.append(node.val)
        dfs_pre_order(node.left, container)
        dfs_pre_order(node.right, container)

    return container


def dfs_in_order(node, container=[]):
    if node.left is None and node.right is None:
        container.append(node.val)
    else:
        dfs_pre_order(node.left, container)
        container.append(node.val)
        dfs_pre_order(node.right, container)

    return container


def dfs_post_order(node, container=[]):
    if node.left is None and node.right is None:
        container.append(node.val)
    else:
        dfs_pre_order(node.left, container)
        dfs_pre_order(node.right, container)
        container.append(node.val)

    return container


dfs_pre_order(tree)
dfs_in_order(tree)
dfs_post_order(tree)
```

```
>>> dfs_pre_order(tree)
[15, 10, 4, 7, 20, 17, 25]
>>> dfs_in_order(tree)
[10, 4, 7, 15, 20, 17, 25]
>>> dfs_post_order(tree)
[10, 4, 7, 20, 17, 25, 15]
```

in C, we need to build a bit more to get to this point, we basically need to build 
a stack to keep track of our visited nodes, like we do with list in python. This is
very straightforward however, and here is a very basic implementation. I only added a `push`
but there would typically be a corresponding `pop` operation as well.

```c
typedef struct Node {
    int          value;
    struct Node *prev;
} Node;

typedef struct Stack {
    int   len;
    Node *head;
} Stack;

Stack *new_stack() {
    Stack *s = malloc(sizeof(Stack));
    s->head = NULL;
    s->len = 0;
    return (s);
}

Node *new_node(int value) {
    Node *n = malloc(sizeof(Node));
    n->prev = NULL;
    n->value = value;

    return (n);
}

void push(Stack *stack, Node *node) {
    if (stack->len == 0) {
        stack->head = node;
        stack->len++;
    } else {
        node->prev = stack->head;
        stack->head = node;
        stack->len++;
    }
}
```

With set in place we can define the walks as follows:

```c
void walk_tree_pre_order(IntBTNode *current_node, Stack *stack) {
    if (current_node->left == NULL && current_node->right == NULL) {
        push(stack, new_node(current_node->value));
    } else {
        push(stack, new_node(current_node->value));
        walk_tree_pre_order(current_node->left, stack);
        walk_tree_pre_order(current_node->right, stack);
    }
}

void walk_tree_post_order(IntBTNode *current_node, Stack *stack) {
    if (current_node->left == NULL && current_node->right == NULL) {
        push(stack, new_node(current_node->value));
    } else {
        walk_tree_post_order(current_node->left, stack);
        walk_tree_post_order(current_node->right, stack);
        push(stack, new_node(current_node->value));
    }
}

void walk_tree_in_order(IntBTNode *current_node, Stack *stack) {
    if (current_node->left == NULL && current_node->right == NULL) {
        push(stack, new_node(current_node->value));
    } else {
        walk_tree_in_order(current_node->left, stack);
        push(stack, new_node(current_node->value));
        walk_tree_in_order(current_node->right, stack);
    }
}
```

Typically you would want to add some `free` calls in here but since the `main`
will run a quit quicly I will not worry about it.

Here is the `main` function.

```c
int main(void) {
    IntBTNode *root_node = new_BT_node(15);
    root_node->left = new_BT_node(10);
    root_node->right = new_BT_node(20);

    root_node->left->left = new_BT_node(4);
    root_node->left->right = new_BT_node(7);

    root_node->right->left = new_BT_node(17);
    root_node->right->right = new_BT_node(25);

    Stack *pre_stack = new_stack();
    Stack *in_stack = new_stack();
    Stack *post_stack = new_stack();

    walk_tree_pre_order(root_node, pre_stack);
    walk_tree_post_order(root_node, post_stack);
    walk_tree_in_order(root_node, in_stack);

    print_stack_v2(pre_stack);
    print_stack_v2(in_stack);
    print_stack_v2(post_stack);
}
```

```
> binary-tree.exe 
[ 25 17 20 7 4 10 15  ]
[ 25 20 17 15 7 10 4  ]
[ 15 20 25 17 10 7 4  ]
```