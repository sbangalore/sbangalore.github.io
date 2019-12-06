---
published: true
tags:
  - quantitative-methods
---
We discuss outcomes, predictions, evaluations, and ROC Curves.

Let us assume a problem where you would like to classify something into "yes" or "no". To make this prediction, you would use examples and features of those examples. These examples would be broken down into a training and validation set. Conventionally, this is a 40/60 split. You will use the training set to train your classifier and then test it on the testing set. Here, we'll discuss how to understand the outcome of this prediction.

To make this more concrete, let's consider an dataset of 100,000 examples of weather patterns.

1. We would like to predict whether it will rain on any given day ("yes" or "no")
2. We might use humidity, wind movements, and whether it rained yesterday as our features
3. We would split the 100,000 examples into a 40,000 example training set and a 60,000 example validation set.
4. We would train our classifier on training set and then test it on the example set; for each example in the training set, we would use its features to predict whether it would rain or not.

This would result in 60,000 predictions. We can break these predictions down as follows:

True positive: correct positive prediction (predict that it will rain, and it does)
True negative: correct negative prediction (predict that it will not rain, and it does not)
False positive: false positive prediction (predict that it will rain, and it does not)
False negative: false negative prediction (predict that it will not rain, and it does)

True positives and negatives are desirable while the other two are not.

|  	|  	| **Actual Values** 	|  	|
|------------------	|-------	|----------------	|----------------	|
|  	|  	| _True_ 	| _False_ 	|
| **Predicted Values** 	| _True_ 	| True Positive (TP) 	| False Positive (FP) 	|
|  	| _False_ 	| False Negative (FN) 	| True Negative (TN) 	|

Total predictions (N) = True positives + True negatives + False positives + False negatives

There are a few popular ways to measure how successful your classifier is.

1. Accuracy is the ratio of total correct predictions to the total number of cases
Accuracy = (TP + TN) / N

2. Recall/Sensitivity is the ratio of correct true predictions that the algorithm recalls
Recall = TP / (TP + FN)

3. Specificity is the ratio of correct false predictions that the algorithm recalls
Specificity = TN / (TN + FP)

4. Precision is the ratio of correct positive predictions
Precision = TP / (TP + FP)

5. Flase positive rate is the fraction of incorrectly labeled positives relative to total negatives
FPR = FP/(FP + TN)

ROC (receiver operating chracteristic curve) provides an indexed score of an observation by plotting the specificity vs the FPR for different values of the tuning parameter tao. AUC is the area under the ROC curve. A higher AUC implies a higher accuracy for the classifier.

Read this [https://www.kaggle.com/tentotheminus9/what-causes-heart-disease-explaining-the-model](kaggle exploration on what causes heart disease) for further concrete applications that you can work out in Google Colab or a Jupyter notebook.
