---
title: Quicksort Notes
---

quicksort is a sorting that uses a partitioning scheme along with recursion to sort an array.

## partition step

the partition will weakly sort an array about a pivot point, that is given a pivot point it will place all values less than it to the left and greater than it to the right. Each of these however do not need to in order, for example 

$${2, 3, 1, 5, 8, 7, 10}$$

is a weakly sorted array about the pivot value 5.

Here is a basic implementation of the partition step in C

```c
int partition(int arr[], int lo. int hi) {
	int pivot_value = arr[hi];
	int current_index = lo - 1;
	int temp

	for (int i = lo; i < hi; i++) {
		if (arr[i] <= pivot_value) {
			current_index++;
			temp = arr[i];
			arr[i] = arr[current_index];
			arr[current_index] = temp;
		}
	}

	// at this point the current_index++ will have the place we need 
	// to place the pivot value at, and also serves as the partition point
	// for the array
	current_index++;
	arr[hi] = arr[current_index];
	arr[current_index] = pivot_value;
	return (pivot_value);
}
```

## Recursion steps

The quicksort will use this and just recursively call partition on smaller and smaller subsets of the array that needs sorting

```c
void quicksort(int arr[], int lo, int hi) {
	if (lo < hi) {
		partition_index = partition(arr, lo, hi);
		partition(arr, lo, partition_index - 1);
		partition(arr, partition_index + 1, hi);
	}
}
```

In python this looks like this:

```python
def partition(arr, lo, hi):
    pivot_value = arr[hi]
    current_index = lo - 1

    for i in range(lo, hi):
        if arr[i] <= pivot_value:
            current_index += 1
            arr[current_index], arr[i] = arr[i], arr[current_index]
    current_index += 1
    arr[hi] = arr[current_index]
    arr[current_index] = pivot_value
    return current_index

def quicksort(arr, lo, hi):
    if lo < hi:
        part = partition(arr, lo, hi)
        quicksort(arr, lo, part - 1)
        quicksort(arr, part + 1, hi)
```