# Interface: Slicer

Slices TCP data up into small bits, optionally adding a delay between each sliced "packet".

## Properties

<a id="average_size"></a>

### average\_size

> `readonly` **average\_size**: `number`

size in bytes of an average packet

***

<a id="delay"></a>

### delay

> `readonly` **delay**: `number`

time in microseconds to delay each packet by

***

<a id="size_variation"></a>

### size\_variation

> `readonly` **size\_variation**: `number`

variation in bytes of an average packet (should be smaller than average_size)
