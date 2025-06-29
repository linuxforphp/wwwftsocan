# FTSOCAN Translation Instructions

## Step 1: Make sure that all strings are correctly indexed in the 'locale/src/strings.php' file.

## Step 2: Open a terminal and generate the 'messages.po' file in 'locale/src':

```
cd locale/src/
xgettext strings.php
mv ../[en|fr_FR]/
```

NOTE: Please make sure to set the correct charset (UTF-8) inside the messages.po file.

## Step 3: Translate all strings using PoEdit.