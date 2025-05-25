import os
import json
import numpy as np
import matplotlib.pyplot as plt
from wordcloud import WordCloud

# === Setup ===

identities = [
    "First-Generation Student", "LGBTQ+", "Immigrant", "Veteran", "Parent", "Low-Income", "Student of Color",
    "Transfer Student", "Non-Traditional Age", "Religious", "Disabled", "International Student",
    "Rural", "Working Student", "STEM Minoritized"
]

themes = [
    "Academic Difficulty", "Faculty Support", "Peer Relationships", "Belonging", "Cultural Representation",
    "Financial Struggles", "Mental Health", "Family Pressure", "Work-Life Balance", "Identity & Discrimination",
    "Career Preparation", "Language Barriers", "Support Networks", "Personal Growth"
]

countMatch = np.zeros((len(themes), len(identities)), dtype=int)
students = []

# === Load Results ===

results_dir = os.path.join(os.getcwd(), "results")
for filename in os.listdir(results_dir):
    if filename.endswith(".json"):
        with open(os.path.join(results_dir, filename), "r", encoding="utf-8") as f:
            data = json.load(f)
            studentName = data.get("name", "").strip()
            themeList = [t.strip() for t in data.get("themes", "").split(",")]
            identityList = [i.strip() for i in data.get("identities", "").split(",")]

            if studentName not in students:
                students.append(studentName)

            for theme in themeList:
                if theme in themes:
                    themeIdx = themes.index(theme)
                    for identity in identityList:
                        if identity in identities:
                            identityIdx = identities.index(identity)
                            countMatch[themeIdx][identityIdx] += 1

# === Create output directory ===

images_dir = os.path.join(os.getcwd(), "public")
os.makedirs(images_dir, exist_ok=True)

# === Generate Word Cloud ===

theme_sums = np.sum(countMatch, axis=1)
word_freq = {themes[i]: int(theme_sums[i]) for i in range(len(themes)) if theme_sums[i] > 0}

wordcloud = WordCloud(width=800, height=400, background_color="white").generate_from_frequencies(word_freq)

plt.figure(figsize=(10, 5))
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis("off")
plt.title("Theme Word Cloud")
plt.tight_layout()
plt.savefig(os.path.join(images_dir, "wordcloud.png"))
plt.close()

# === Generate Stacked Horizontal Bar Chart ===

# Transpose to match MATLAB’s barh(countMatch') format
data = countMatch.T

# Custom color palette from MATLAB script (normalized RGB)
colors = [
    [0.2, 0.8, 0.8], [1, 0.4, 0.4], [0.9, 0.9, 0.2], [0.7, 0.3, 0.9], [0.1, 0.9, 0.3],
    [0.3, 0.6, 1], [1, 0.2, 0.6], [0.5, 0.1, 0.5], [0.1, 0.7, 0.5], [0.9, 0.4, 0.4],
    [0.8, 0.5, 0.9], [0.9, 0.5, 0.3], [0.4, 0.8, 0.9], [0.6, 0.8, 0.5]
]

fig, ax = plt.subplots(figsize=(12, 8))
bars = np.zeros(len(identities))

for i in range(len(themes)):
    ax.barh(
        y=np.arange(len(identities)),
        width=data[:, i],
        left=bars,
        color=colors[i % len(colors)],
        label=themes[i]
    )
    bars += data[:, i]

ax.set_yticks(np.arange(len(identities)))
ax.set_yticklabels(identities, fontsize=9)
ax.set_xlabel("Frequency")
ax.set_ylabel(" ")
ax.set_title("Theme Frequency per Identities Bar Chart")
ax.invert_yaxis()  # Match MATLAB's 'YDir', 'reverse'
ax.legend(loc='best', bbox_to_anchor=(1.05, 1), borderaxespad=0., title="Themes")
plt.tight_layout()
plt.savefig(os.path.join(images_dir, "barchart.png"))
plt.close()
