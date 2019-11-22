---
published: false
---
This discussion will clarify notions around outcomes and predictions.

Let us assume a problem where you would like to classify something into "yes" or "no". To make this prediction, you would use examples and features of those examples. These examples would be broken down into a training and validation set. Conventionally, this is a 40/60 split. You will use the training set to train your classifier and then test it on the testing set. Here, we'll discuss how to understand the outcome of this prediction.

To make this more concrete, let's consider an dataset of 100,000 examples of weather patterns.

1. We would like to predict whether it will rain on any given day ("yes" or "no")
2. We might use humidity, wind movements, and whether it rained yesterday as our features
3. We would split the 100,000 examples into a 40,000 example training set and a 60,000 example validation set.
4. We would train our classifier on training set and then test it on the example set; for each example in the training set, we would use its features to predict whether it would rain or not.

This would result in 60,000 predictions. We can break these predictions down as follows:

Total predictions = True positives + True negatives + False positives + False negatives

True positive: correct positive prediction (predict that it will rain, and it does)
True negative: correct negative prediction (predict that it will not rain, and it does not)
False positive: false positive prediction (predict that it will rain, and it does not)
False negative: false negative prediction (predict that it will not rain, and it does)

True positives and negatives are desirable while the other two are not.

|  	|  	| **Actual Values** 	|  	|
|------------------	|-------	|----------------	|----------------	|
|  	|  	| _True_ 	| _False_ 	|
| **Predicted Values** 	| _True_ 	| True Positive 	| False Positive 	|
|  	| _False_ 	| False Negative 	| True Negative 	|

