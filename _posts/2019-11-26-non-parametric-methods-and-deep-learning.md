---
published: false
---
In this post, we explore the Kernel Method which is develops a function to map non-linear data points, such as stock-prices and labels of images.

Specifically, we construct flexible nonlinear, functional approximations and see how to implement it in Python. These are also called non-parametrics. There are two main methods to create nonlinear functional approximations.

1. Kernel Method
2. Neural Networks

The Kernel method uses a set of basis functions adaptively to achieve optimal performance on a dataset. First, let us define a similarity measure between datapoints, defined as the distance between any two datapoint.

\phi(x_1) = [] 