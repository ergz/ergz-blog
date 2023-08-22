---
title: Bubble Sort Notes
tags:
    - learning
    - algos
---

Part of collection of notes as I read through an Algo and DS book [[notes/learning-quicksort]]

Bubble sorting is a sorting algorithm (duh), the basic algorithm is this:

Iterate through an array with an index `j` every time we encounter a case where the value indexed by `j` is greater then the value indexed by `j+1` we swap them. We will need to make multiple passes through our array in order to perform the required swaps the total number of passes will be the length of the array.

```c

void bubble_sort(int* arr, int len) {
	int temp; // we will need this for swapping
	for (int i = 0; i < len; i++) {
		for (j = 0; j < len - 1; j++) {
			if (arr[j] > arr[j+1]) {
				temp = arr[j];
				arr[j] = arr[j+1];
				arr[j+1] = temp;
			}
		}
	}
}

// print the array with [] notation
void print_array(int* arr, int len) {
	printf("[ ");
	for (int i = 0; i < len; i++) {
		printf("%d ", arr[i]);
	}
	printf("]\n");

}

int main() {
	int test[5] = {1, 3, 2, 7, 6};
	printf("before sort\n");
	print_array(test, 5);
	bubble_sort(test, 5);
	printf("after sort\n");
	print_array(test, 5);
}

```

## Improvements

How can we can make the algorithm end early?

One thing we can do is have a "swap" counter for each pass that counts up the number of swaps that occurred. Whenever this counter 0 after a pass means that the iteration required no swaps therefore all is in order. Here is an implementation of that.

```c
void bubble_sort(int arr[], int len) {
    int total_iterations = 0;
    int temp;
    int total_swaps = 1;

    for (int i = 0; i < len; i++) {
        total_iterations++;
        if (total_swaps == 0) {
            break;
        }

        total_swaps = 0;

        for (int j = 0; j < len - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                total_swaps++;
                temp = arr[j + 1];
                arr[j + 1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    printf("total iterations: %d\n", total_iterations);

}
```

I just realized we can make this even simpler with this: 

```c
// basic swap function 
void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void bubble_sort_3(int arr[], int len) {
    int swaps = 1;
    while (swaps > 0) {
        swaps = 0;
        for (int i = 0; i < len - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                swap(&arr[i], &arr[i + 1]);
                swaps++;
            }
        }
    }
}
```

just for the fun of it, here it in python

```python
from typing import List

def bubble_sort(arr: List[int]):
    for i in range(len(arr)):
        for j in range(len(arr) - 1):
            if arr[j] > arr[j + 1]:
                temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
  
if __name__ == "__main__":
    a = [5, 4, 3, 2, 1]
    print(a)
    bubble_sort(a)
    print(a)
```

pretty sure people say don't use for loops in python so how can I get rid of them here? I don't think it makes sense to do any list comprehension stuff here. One thing I can do is use the tuple unpacking (I think its tuple unpacking) trick and do the swap in one go

```python
def bubble_sort2(arr: List[int]):
    for i in range(len(arr)):
        for j in range(len(arr) - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
```


```cmd
❯ python bubble-sort.py
[5, 4, 3, 2, 1]
[1, 2, 3, 4, 5]
```