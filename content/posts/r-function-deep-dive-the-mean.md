---
title: "R Function Deep Dive: The Mean"
date: 2021-03-13T23:01:18-08:00
draft: true
description: "In this article we take a deep dive into some of R's most important functions"
tags: [statistics, R]
---

# Introduction

Recently I have been listening and reading a lot of what Casey Muratori preaches, build something 
from scratch! This is somewhat hard to apply with some of the work that I do, namely when doing 
statistics. With that said I do use a programming language that is built upon C.


## Mean

When we print the `mean` function in R we get the following,

```r
function (x, trim = 0, na.rm = FALSE, ...) 
{
    if (!is.numeric(x) && !is.complex(x) && !is.logical(x)) {
        warning("argument is not numeric or logical: returning NA")
        return(NA_real_)
    }
    if (na.rm) 
        x <- x[!is.na(x)]
    if (!is.numeric(trim) || length(trim) != 1L) 
        stop("'trim' must be numeric of length one")
    n <- length(x)
    if (trim > 0 && n) {
        if (is.complex(x)) 
            stop("trimmed means are not defined for complex data")
        if (anyNA(x)) 
            return(NA_real_)
        if (trim >= 0.5) 
            return(stats::median(x, na.rm = FALSE))
        lo <- floor(n * trim) + 1
        hi <- n + 1 - lo
        x <- sort.int(x, partial = unique(c(lo, hi)))[lo:hi]
    }
    .Internal(mean(x))
}
# <bytecode: 0x55c6c7cee9b8>
# <environment: namespace:base>
```

essentially we have logic in R, but ultimately an _Internal_ version of the `mean` function is called.
The goal now is to go hunting for this internal version of the function. We can find this definition
in the `src` directory of `$R_HOME`

When looking at the source code for `Internal` and `Primitive` types we are presented.

```c
/* printname    c-entry     offset  eval    arity   pp-kind      precedence rightassoc
 * ---------    -------     ------  ----    -----   -------      ---------- ----------*/
```