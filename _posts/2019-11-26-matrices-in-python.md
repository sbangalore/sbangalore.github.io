---
published: false
---
This post discusses matrices and their libaries in python.

There are few libaries that are very import when working with linear algebra in Python. Numpy (np), Scipy (sp), TensorFlow (tf), and PyTorch (torch).

Here are a few idiosyncracies with them.

Multiplying (np.multiply(x1,x2) or x1 * x2) in np uses broadcasting. To have a dot multiplication/inner product, you have to use np.dot(x1,x2).