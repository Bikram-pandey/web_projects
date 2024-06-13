import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sb

df = pd.read_csv("Diwali Sales Data.csv",encoding="unicode-escape")
dp = df.drop(columns=["Status","unnamed1"])
ds = pd.isnull(dp)
dev = (dp.dropna())
print(dev.columns)

""" sns = sb.countplot(x="Age Group", data=dev, hue="Gender" )
for bars in sns.containers:
    sns.bar_label(bars)
plt.show() """

sales = dev.groupby("Age Group")["Amount"].sum().reset_index()
sb.barplot(x="Age Group",y="Amount",data=sales)
plt.show()





