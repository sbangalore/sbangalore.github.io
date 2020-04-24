---
published: true
---
How to deal with lots of users 💥 (lucky you!)

**_You’re the CEO of new Social Media Network, BookFace._**

Let’s talk about scaling effectively a.k.a. how to deal with too much — never the case 😉 — traffic. Here’s the story. You’ve started your dream social media company, “BookFace Co”, an online web service that connects users across the globe. You start off marketing to your close friends and family. Along the way, you grow a lot. How do you handle such growth? That’s scalability.

## Early beginnings

You’ve started BookFace Co and have hosted a launch site on GoDaddy.com using Wordpress.

![]({{site.baseurl}}/https://imgur.com/7eaClWH)

It’s an exciting time! You tell all your friends on campus to spread the word and contact the sororities on campus. Y’all agree on a strategy to make it exclusive to the  campus and develop a small UI.

As you develop the app, interest starts piling up. You build out a preliminary app and start noticing that the website is slowing down. This is because you’re sharing a machine which is hosting your WordPress installation on GoDaddy with several other GoDaddy clients.

## The first move and growth spurt

It’s time to move on to greener fields over at AWS. Here’s where you switch out to a dedicated VPS, a virtual private server in which you’re the only one, unlike GoDaddy. This is offered by a company like AWS or Azure, who run the VPS on a software like Citrix or VMWare.

You finish the early version of the app and put it on AWS. It’s exciting times! The website’s fast, and the sorority sisters are spreading the word 📢 Reddit and Product Hunt catch notice. You’re the talk of the town. Tens of thousands of new users flood the servers. What do we do now ?!

## Vertical scaling

You have a couple options in play: vertical and horizontal scaling. Vertical scaling takes that computer that you have with AWS and expands it.

For example, on your computer you might have 8 GB of RAM and a 4 core CPU. Vertical scaling is adding to the capabilities of that computer. Maybe you add another 8 GB to make it 16 GB of RAM.

So, you decide to expand the EC2 on AWS that you have by adding more RAM and processing power. That fixes the problem for a couple of days before the traffic starts growing exponentially. Oh no 😫 ! Or, rather, oh yes! (:

For reference, popular startups often experience growth rates 20+% per week (with social media having even faster growth!). Here’s Insta:

![]({{site.baseurl}}/https://i.imgur.com/fOVcZDQ.png)

At this point, adding more stuff is getting expensive!

![]({{site.baseurl}}/https://i.imgur.com/aqtlkmK.png)

Scaling is somewhat effective as you can see from the above image on storage. However, it starts getting expensive. Scaling RAM from 8 to 16 GB is easier and cheaper than scaling from 64 GB to 128 GB. 

## Horizontal scaling

Now, continually upgrading the one system costs 💵 💵 💵 💵 . You’re still a student and want to keep BookFace lean until you can make money through ads. As an alternative to the one super computer you’re now building up, you set up a network of computers (“horizontal scaling”).

You go to amazon and buy a few more Ec2 instances and set up a couple of load balancers to take the traffic you get from your users and distribute them along to the multiple instances that you now have (including the one you had from before.)

Think of your shift supervisor. They need you to work certain shifts (maybe some nights, some days, etc.) and your bud to work other shifts. The shift supervisor is your load balancer.

Now that you have “excess capacity”, you go and sell the initial one you had with no disruption 🙌

You step back. Here’s your new system for bookface.com. The process as a picture and a break down below.

![]({{site.baseurl}}/https://i.imgur.com/s4Tow9t.png)

First, a user types in BookFace.com. This is then directed to a DNS which directs the request to a AWS data centre (in this case, located in Virginia. A load balancer ( i.e. AWS Elastic Load Balancing) directs the request to one of the EC2 servers you have set up. The servers direct any requests for information to another load balancer which then directs it to the database (perhaps AWS Dynamo DB) you have set up.

## Db replication & denormalization a.k.a. how to get paid

Wait, what about the DBs? What’s AWS Dynamo DB?

When you set up BookFace.com, you stored your information locally on your computer (SQLite). When things started getting hot, you started getting worried about the 🚔 stepping at your door. With thousands of usernames, passwords, addresses, phone numbers, likes, and dislikes — you need something secure and quick. You’d also like to get into that sweet data analytics for advertising money 💰. To do that you needed something non-local. There are two options at the door:

Upgrade the database you now have into a hosted SQL db (i.e. MySQL)

Change it up and go to NoSQL (i.e. MongoDB)

SQL is structured data… i.e. in tables (for example one table contains user data, another could contain their relationships, another could contain data on groups, etc.)

Although there’s more support and you’re more comfy with MySQL, you decided to go with NoSQL for the improved speed, ability to horizontally scale, and flexibility for data analytics. While MySQL has tables, NoSQL allows you to look at data in different ways, add data on the fly, and work with modern analytics programs.

## Clones

As you noticed, you set up each of your databases and servers with a clone (exactly what it sounds like). They all have the same general information, but don’t have user specific details. This is instead stored in a centralized data storage elsewhere such as Amazon Elasticache Redis.

**Single Point of Failure** Having two of each load balancer, VPS, and DB ensure’s that there’s no SPOF. i.e. if one of the load balancers, VPs, or DBs fail, another one is immediately available as a backup. Although AWS provides redundancy through availability zones (i.e. your applications are hosted in multiple isolated areas in Virginia), you might also want to set up the application in two different AWS regions for extra uptime.

The concepts here are summarized in RAID levels — which specify the redundancy and speed of different ways of making clones.

- Raid 0: fast, 100% utilization, 2 drives, can not withstand drive failure
- Raid 1: medium, 50% utilization, 2 drives, can withstand 1 drive failure
- Raid 5: slow, 70-95% utilization, 3 drives, can withstand 1 drive failure
- Raid 6: slow, 50-90% utilization, 4 drives, can withstand 2 drive failures
- Raid 10 (1 + 0): high, 50% utilization, 4 drives, can withstand 1 drive failure in subarray

## Caching

Now, BookFace is running smoothly. Even Rihanna has signed up for it 🤩

Your job is getting easier as you set AWS to autoscale as more investors are coming in. You hire a team of a couple hundred devs and give them free coffee and food from the ad money that’s rolling in.

They’re pushing out new features for BookFace and the service starts slowing down again 😥

You start your caching service here to bring BookFace back up to speed.

Facebook started using caching to massive advantage early on in their business.

Caching allows users to access frequently accessed objects quicker.

Let’s say you’re a librarian. You notice people are reading/requesting certain books more. You store those books close to the entrance of the library, rather than in the stacks on the 9th floor. This saves both you and them time. This is caching.

Another example!

On your browser, you keep favorites. You’ll only keep the favorites you use most often and switch them when you get new favorites. This can also be considered caching.

It’s usually stored in RAM vs in the storage device for noncached items. There’s a couple ways (and a third option to do a hybrid) to cache:

**File based Caching**

Redis/Memcache

File based caching is better for larger objects and is much slower, while redis/memcache run about 10x faster if both are run on the same network (i.e. same network speed).

Redis and memcache both work on TCP networks (meaning that internet speed matters). Also, they are much smaller, so you should put the hottest/most frequently used items on these.

Within Redis and memcache, we have a couple of options, where Cached objects >> Cached Db queries. Yes, you heard that right, cached objects are objectively better than cached DB queries. Here’s an example of memcache:

![]({{site.baseurl}}/https://i.imgur.com/X59r4mZ.jpg)

Queries from a database are when a user asks for a certain thing to be pulled from a database (for example, the 40 most recent posts by Rihanna).

Caching an object assembles a class from recently pulled queries from datasets and stores it in an object (including results and raw data), so for example the posts from Rihanna and what the result is. Then, when the raw data changes, the cached object also changes allowing the user to access the cached object (i.e. Rihanna posts a new image).

If you instead cache database queries, the raw data wouldn’t be included, meaning it would be discarded if Rihanna posts a new image and would have to be reconstructed 😟

You decide to implement caching and get some cool results. More people are staying on the website!

![]({{site.baseurl}}/https://imgur.com/7eaClWH)

## Asynchronism

Horizontal Scaling, Caching, DB Denormalization — BookFace is super scalable now.

There’s one last thing left: unlimited scrolling — the ultimate way to capture attention! 

To implement this, you ask your engineers (you’re no longer in the codebase now … you’re off in Cannes chilling and having wine) to implement asynchronism.

Once you arrive in Cannes, you set up your Apple HomeKit to the smart home in the hotel. You head to sleep and before you switch off the light, set the coffemaker to brew a fresh cup of joe ☕ before you wake-up. That’s asynchronism. You’re sleeping and brewing coffee at the same time, saving you time.

There’s a couple ways to do asynchronism.

The first way is like the coffee. You process your pages after upload rather than dynamically. For example, the BookFace page render the next posts while you’re browsing the current posts and then use a content delivery network — CDN (such as AWS CloudFront) to serve them up.

The second way is to let the user know that the part is loading so they can do other things (like chat up their friends) and then serve it up when it’s finished.

This is more like Starbucks, where you don’t have the coffee brewed instantly before you arrive, but can chat up with your friends while you’re waiting for it to be brewed. In the same style, if you used Ritual.co or UberEats to preorder the Starbucks before you arrive, you would be back in the first way.

Both will allow you to have a clean front end and a very snappy backend. BookFace is now a global leader in scalability. Congratulations! 👏

That’s it for this post… Congrats on scaling BookFace up to where it is, you superstar!
