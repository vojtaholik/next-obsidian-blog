---
layout: ../../../layouts/MarkdownPostLayout.astro
title: Thermocycler
pubDate: 2022-11-28
description: Let me show you how I have built my own thermocycler machine for PCR reactions in genetics.
author: Martin D.C.
image:
  url: https://docs.astro.build/assets/full-logo-light.png
  alt: The full Astro logo.
tags:
  - engineering
  - electronics
  - arduino
  - genetics
  - biology
  - science
---
- [01. What it does](#intro)
- [02. Construction](#construction)

The **thermal cycler** (also known as a **thermocycler**, **PCR machine** or **DNA amplifier**) is a [laboratory](https://en.wikipedia.org/wiki/Laboratory "Laboratory") apparatus most commonly used to amplify segments of [DNA](https://en.wikipedia.org/wiki/DNA "DNA") via the [polymerase chain reaction](https://en.wikipedia.org/wiki/Polymerase_chain_reaction) (PCR).[[1]](https://en.wikipedia.org/wiki/Thermal_cycler#cite_note-1) Thermal cyclers may also be used in laboratories to facilitate other temperature-sensitive reactions, including [restriction enzyme](https://en.wikipedia.org/wiki/Restriction_enzyme "Restriction enzyme") digestion or rapid diagnostics.[[2]](https://en.wikipedia.org/wiki/Thermal_cycler#cite_note-2) The device has a _thermal block_ with holes where tubes holding the reaction mixtures can be inserted. The cycler then raises and lowers the temperature of the block in discrete, pre-programmed steps.



# Final result

![[thermoFinal1.jpg]]
![[thermoFinal2.jpg]]


<em>Four standart PCR vials in a heating chamber. Heating & cooling controlled by two TEC Peltier Elements with separate PID loop with custom software.</em>

<em>Custom controlling software with logging and history.</em>

---
![[thermoFinal3.jpg]]
# Intro

One of the most common process in genetics is a PCR, which is shorthand for [polymerase chain reaction](https://www.bosterbio.com/protocol-and-troubleshooting/pcr-principle).

It is a set of chemical reactions that is giving us possibility to selectively **duplicate** a specific **part of DNA** that we extract from a tissue (cell) sample.

![[pcr1.png]]

For it to work, it needs a device that controls temperature **[C°]** in time. **[t]**

What we want from machine is to heat the sample as follows:

1.  **94 C°** for **30s** (Denaturation)
2.  **56 C°**  for  **30s** (Annealing)
3.  **72 C°** for **40s** (Extension)
   
   **ΔC°/s** otherwise called ramp-up & ramp-down time also plays a role. So we will need both heating and cooling.

Commercially available units are usually pretty expensive and look like this:
![[thermo3.jpg]]

---

# Planning
Usual three stages:

1. find diagrams, plans, pdfs of existing commercial products and copy what you can (i.e. do not reinvent the wheel)
2. make a breadboard version and measure the performance 
3. make more robust design

These were probably the two **most useful diagrams** I have found while browsing and are describing the basic structure of device:

![[thermo1.png]]
![[thermo2.jpg]]
[source1](https://www.genengnews.com/insights/development-and-evolution-of-pcr/) [source2](https://www.semanticscholar.org/paper/Temperature-Control-for-PCR-Thermocyclers-Based-on-Qiu-Yuan/8d26bb6e109e0f6a9a8ce5929e7fd1c4f334d723/figure/1)

We can see that a primary method for heating and cooling is a **Peltier** element (**TE** or **TEC** in diagrams). 

The most complex part seems to be a "sample block", which needs to be made out of material with great heating conductivity and also needs to have as minimal mass as possible, because more material = heating and cooling takes longer so our **ΔC°/s** would also increase. 

---

# Construction

First I constructed a diagram of whole device:

![[thermo0.png]]

Device has **two identical sections** that consist of the controller itself (Arduino in this case) that is connected to **H-Bridge** driver that **forwards  power** to the TEC Peltier elements.  H-Bridge can **reverse polarity** direction so Peltier can heat and cool the sample block when needed.

Why two identical sections you ask? Well because if we heated the mini vials inserted into the device only from the bottom, there would be lots of condensation due to the temperature gradient inside the vials and from what I have read could interfere with undergoing PCR reaction. Most **commercial designs are using heated top lid** for this reason, usually heated with resistance wire. (as lid does not have so much mass to be heated up) 

I will use TEC Peltier element for both sample block and a lid. Because I dont like the idea of the top lid slacking behind the temperature curve of a sample block.

Let' put it to test on  a breaboard version of a project. Before I make  a proper sample block, I used a small chamber with water just to see how Peltier works to make some measurements beforehand.