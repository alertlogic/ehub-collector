let invocationCounts = {};

function logInvocationResult(functionName, isSuccess) {
  const key = functionName;

  if (!invocationCounts[key]) {
    invocationCounts[key] = { invocations: 0, errors: 0 };
  }

  invocationCounts[key].invocations++;

  if (!isSuccess) {
    invocationCounts[key].errors++;
  }
}

function getInvocationCounts() {
  return invocationCounts;
}

function resetInvocationCounts() {
  invocationCounts = {};
}

module.exports = { logInvocationResult, getInvocationCounts, resetInvocationCounts };