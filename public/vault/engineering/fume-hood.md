---
layout: ../../../layouts/MarkdownPostLayout.astro
title: Fume Hood
pubDate: 2023-06-01
description: DIY Fume hood construction!
author: Martin D.C.
image:
  url: https://docs.astro.build/assets/full-logo-light.png
  alt: The full Astro logo.
tags:
  - genetics
  - biology
---
A **fume hood** (sometimes called a **fume cupboard** or **fume closet**) is a type of local [ventilation](https://en.wikipedia.org/wiki/Ventilation_(architecture) "Ventilation (architecture)") device designed to limit exposure to hazardous or toxic fumes, [vapors](https://en.wikipedia.org/wiki/Vapor "Vapor"), or [dusts](https://en.wikipedia.org/wiki/Dust "Dust"). The device is an enclosure with a movable [sash window](https://en.wikipedia.org/wiki/Sash_window "Sash window") on one side that traps and exhausts gases and particulates either out of the area (through a [duct](https://en.wikipedia.org/wiki/Duct_(industrial_exhaust) "Duct (industrial exhaust)")) or back into the room (through [air filtration](https://en.wikipedia.org/wiki/Air_filter "Air filter")) and is most frequently used in [laboratory](https://en.wikipedia.org/wiki/Laboratory "Laboratory") settings.

# Final Result
![[fume1.jpg]]

*Fume hood connected to a chimney.*

---

# Planning

The biggest issue in design is, of course, the **materials** used, as they will dictate the range of chemicals we can use inside the fume hood. Acidic chemicals will be highly corrosive, so we need to ensure our fans for air outtake will be sealed.

Fortunately, chemical resistance properties are well-tested, and we can find useful [tables](https://www.google.com/search?sca_esv=a48dbaf87d89a746&rlz=1C1BYYL_csCZ1083CZ1083&sxsrf=ACQVn0_ihCPE-6el9ogjdkzx1StmpmTSiQ:1707064253086&q=abs+chemical+resistance&tbm=isch&source=lnms&sa=X&ved=2ahUKEwj2wafzjZKEAxXcxQIHHSvvD-cQ0pQJegQIDBAB&biw=818&bih=851&dpr=1.56#imgrc=rVRHYNYrTx1yAM) of compatible chemicals on the web.

Mine is made out of laminated wood coated with a liquid fireproof layer, and connectors are 3D printed out of **ABS**.

For fans, I opted for marine-purposed fans used in highly salinated environments and should be completely sealed.

![[fume8.jpg]]

***Photo:** Pre-viz in Blender*

In the pre-viz image, you can see two boards called "**airfoils**" which make use of **Bernoulli's principle**: Within a horizontal flow of fluid, points of higher fluid speed will have less pressure than points of slower fluid speed.

This is useful as it will create a lower pressure area towards the rear of the cabinet (because air is forced to move faster there), sucking all the chemical vapors away from the cabinet entrance.

For this project, I did not run any experimental computer fluid simulations and decided to replicate exact dimensions from already existing commercially available models.

---

# Construction

![[fume9.jpg]]

*Top view of three marine-purposed fans and a simple electronics setup (a PWM regulator with a 12V supply).*

![[fume5.jpg]]
The cabinet itself is connected with dovetails, glued, and sealed with silicon.

![[fume6.jpg]]
3D printed knobs and covers for plexiglass installment.