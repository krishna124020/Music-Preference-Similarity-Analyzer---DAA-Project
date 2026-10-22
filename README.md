# Music Preference Similarity Analyzer - DAA Project

A clean, academic implementation of the classic **Counting Inversions** problem using **Divide and Conquer (Enhanced Merge Sort)**.

---

## 📌 Project Overview
Recommender systems (such as Spotify and Netflix) match users based on how closely their taste rankings align. A canonical algorithmic metric for preference similarity is counting **Inversions** between two ranked lists:
- **0 Inversions** $\rightarrow$ Identical tastes (**100% Similarity**)
- **Max Inversions $\frac{n(n-1)}{2}$** $\rightarrow$ Completely opposite tastes (**0% Similarity**)
- **Formula:**
  $$\text{Similarity Score} = \left(1 - \frac{\text{Inversions}}{\text{Max Inversions}}\right) \times 100\%$$

---

## 🧠 DAA Algorithmic Complexity

| Metric | Brute Force Approach | Divide & Conquer (Our Project) |
| :--- | :--- | :--- |
| **Technique** | Nested loops checking all pairs $(i, j)$ | Modified Merge Sort |
| **Time Complexity** | $O(n^2)$ | $O(n \log n)$ |
| **Recurrence Relation** | N/A | $T(n) = 2T(n/2) + O(n)$ |
| **Master Theorem** | N/A | Case 2: $a=2, b=2, d=1 \implies O(n \log n)$ |
| **Space Complexity** | $O(1)$ | $O(n)$ auxiliary array |

---

## 🚀 How to Run the Project
1. Open this folder in your File Explorer: `D:\Personal\Krishna DAA project`
2. **Double-click `index.html`** to open it directly in Google Chrome or Microsoft Edge.
3. No Python, Node.js, or server installation is needed!
