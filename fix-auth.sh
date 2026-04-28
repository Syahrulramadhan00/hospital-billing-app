#!/bin/bash
for file in resources/js/Pages/Auth/*.jsx; do
  sed -i -E 's/text-gray-[0-9]+/text-base-content\/80/g' "$file"
  sed -i -E 's/text-sm font-semibold text-base-content\/80 mb-2/label-text font-semibold/g' "$file"
  sed -i -E 's/ml-2 text-sm font-medium text-base-content\/80 cursor-pointer/label-text cursor-pointer/g' "$file"
done
