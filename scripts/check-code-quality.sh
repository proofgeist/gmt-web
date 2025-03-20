#!/bin/bash

# Script to run code quality checks after code generation
# This script runs linting and type checking to ensure code quality

echo "Running code quality checks..."
echo "--------------------------------------------------------------"

# Run ESLint
echo "Running ESLint..."
pnpm lint
LINT_EXIT_CODE=$?

# Run TypeScript type checking
echo "--------------------------------------------------------------"
echo "Running TypeScript type checking..."
pnpm check:types
TS_EXIT_CODE=$?



echo "--------------------------------------------------------------"
echo "Code quality check summary:"

if [ $LINT_EXIT_CODE -eq 0 ]; then
  echo "✅ ESLint: No issues found"
else
  echo "❌ ESLint: Issues found (exit code $LINT_EXIT_CODE)"
  echo "   Run 'pnpm lint --fix' to attempt to fix issues automatically"
fi

if [ $TS_EXIT_CODE -eq 0 ]; then
  echo "✅ TypeScript: No issues found"
else
  echo "❌ TypeScript: Issues found (exit code $TS_EXIT_CODE)"
  echo "   Fix type errors before committing"
fi

echo "--------------------------------------------------------------"

# Return overall status (success only if all checks pass)
if [ $LINT_EXIT_CODE -eq 0 ] && [ $TS_EXIT_CODE -eq 0 ]; then
  echo "✅ All critical checks passed!"
  exit 0
else
  echo "❌ Some checks failed. Please fix the issues before committing."
  exit 1
fi 