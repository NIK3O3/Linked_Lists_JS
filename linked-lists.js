"use strict";

class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function runRecursively(step) {
  function processBlock(size) {
    if (size === 1) return step();

    const half = size / 2;
    return processBlock(half) && processBlock(half);
  }

  function grow(size) {
    if (!processBlock(size)) return;
    grow(size * 2);
  }

  grow(1);
}

function reverseList(head) {
  let previous = null;
  let current = head;

  runRecursively(() => {
    if (current === null) return false;

    const next = current.next;
    current.next = previous;
    previous = current;
    current = next;
    return true;
  });

  return previous;
}

// 1. Об'єднати два відсортовані списки з їхніх початкових вузлів
function mergeTwoLists(list1, list2) {
  const dummy = new ListNode();
  let tail = dummy;

  runRecursively(() => {
    if (list1 === null || list2 === null) return false;

    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }

    tail = tail.next;
    return true;
  });

  tail.next = list1 === null ? list2 : list1;
  return dummy.next;
}

// 2. Прибрати дублікати, залишивши перший вузол кожного значення
function deleteDuplicates(head) {
  if (head === null || head.next === null) return head;

  if (head.val === head.next.val) {
    head.next = head.next.next;
    return deleteDuplicates(head);
  }

  head.next = deleteDuplicates(head.next);
  return head;
}

// 3. Знайти цикл двома вказівниками. Список не змінюється
function hasCycle(head) {
  let slow = head;
  let fast = head;
  let found = false;

  runRecursively(() => {
    if (fast === null || fast.next === null) return false;

    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      found = true;
      return false;
    }

    return true;
  });

  return found;
}

// 4. Перевпорядкувати на місці: L0, Ln, L1, Ln-1, ...
function reorderList(head) {
  if (head === null || head.next === null) return;

  let slow = head;
  let fast = head;

  runRecursively(() => {
    if (fast.next === null || fast.next.next === null) return false;

    slow = slow.next;
    fast = fast.next.next;
    return true;
  });

  let right = reverseList(slow.next);
  slow.next = null;
  let left = head;

  runRecursively(() => {
    if (right === null) return false;

    const nextLeft = left.next;
    const nextRight = right.next;
    left.next = right;
    right.next = nextLeft;
    left = nextLeft;
    right = nextRight;
    return true;
  });
}

// 5. Видалити значення заданого вузла без доступу до head
function deleteNode(node) {
  node.val = node.next.val;

  if (node.next.next === null) {
    node.next = null;
    return;
  }

  deleteNode(node.next);
}

// 6. Подвоїти число по цифрах без перетворення всього числа на Number
function doubleIt(head) {
  if (head.val >= 5) head = new ListNode(0, head);

  let current = head;

  runRecursively(() => {
    if (current === null) return false;

    const carry = current.next !== null && current.next.val >= 5 ? 1 : 0;
    current.val = ((current.val * 2) % 10) + carry;
    current = current.next;
    return true;
  });

  return head;
}

// 7. Об'єднати k списків поділом навпіл. Повторно використовуємо їхні вузли
function mergeKLists(lists) {
  function mergeRange(start, end) {
    if (start >= end) return null;
    if (end - start === 1) return lists[start];

    const middle = start + Math.floor((end - start) / 2);
    const left = mergeRange(start, middle);
    const right = mergeRange(middle, end);
    return mergeTwoLists(left, right);
  }

  return mergeRange(0, lists.length);
}

// 8. Розвернути лише повні групи по k вузлів, не змінюючи val
function reverseKGroup(head, k) {
  if (head === null || k === 1) return head;

  const dummy = new ListNode(0, head);
  let beforeGroup = dummy;

  runRecursively(() => {
    let groupEnd = beforeGroup;
    let count = 0;

    runRecursively(() => {
      if (count === k || groupEnd.next === null) return false;
      groupEnd = groupEnd.next;
      count += 1;
      return true;
    });

    if (count < k) return false;

    const afterGroup = groupEnd.next;
    const oldStart = beforeGroup.next;
    let previous = afterGroup;
    let current = oldStart;

    runRecursively(() => {
      if (current === afterGroup) return false;

      const next = current.next;
      current.next = previous;
      previous = current;
      current = next;
      return true;
    });

    beforeGroup.next = groupEnd;
    beforeGroup = oldStart;
    return true;
  });

  return dummy.next;
}

// 9. Стабільно розділити початкові вузли на значення < x та >= x
function partition(head, x) {
  const lessDummy = new ListNode();
  const greaterDummy = new ListNode();
  let lessTail = lessDummy;
  let greaterTail = greaterDummy;

  function distribute(node) {
    if (node === null) return;

    const next = node.next;
    node.next = null;

    if (node.val < x) {
      lessTail.next = node;
      lessTail = node;
    } else {
      greaterTail.next = node;
      greaterTail = node;
    }

    distribute(next);
  }

  distribute(head);
  lessTail.next = greaterDummy.next;
  return lessDummy.next;
}

function listFromArray(values) {
  const dummy = new ListNode();
  let tail = dummy;
  let index = 0;

  runRecursively(() => {
    if (index === values.length) return false;
    tail.next = new ListNode(values[index]);
    tail = tail.next;
    index += 1;
    return true;
  });

  return dummy.next;
}

function listToArray(head) {
  const values = [];
  let current = head;

  runRecursively(() => {
    if (current === null) return false;
    values[values.length] = current.val;
    current = current.next;
    return true;
  });

  return values;
}

console.log(
  "1:",
  listToArray(
    mergeTwoLists(listFromArray([1, 2, 4]), listFromArray([1, 3, 4])),
  ),
);
console.log("1:", listToArray(mergeTwoLists(null, null)));
console.log("1:", listToArray(mergeTwoLists(null, listFromArray([0]))));

console.log("2:", listToArray(deleteDuplicates(listFromArray([1, 1, 2]))));
console.log(
  "2:",
  listToArray(deleteDuplicates(listFromArray([1, 1, 2, 3, 3]))),
);

const cycle1 = listFromArray([3, 2, 0, -4]);
cycle1.next.next.next.next = cycle1.next;
console.log("3:", hasCycle(cycle1));
const cycle2 = listFromArray([1, 2]);
cycle2.next.next = cycle2;
console.log("3:", hasCycle(cycle2));
console.log("3:", hasCycle(listFromArray([1])));

const reordered1 = listFromArray([1, 2, 3, 4]);
reorderList(reordered1);
console.log("4:", listToArray(reordered1));
const reordered2 = listFromArray([1, 2, 3, 4, 5]);
reorderList(reordered2);
console.log("4:", listToArray(reordered2));

const deleted1 = listFromArray([4, 5, 1, 9]);
deleteNode(deleted1.next);
console.log("5:", listToArray(deleted1));
const deleted2 = listFromArray([4, 5, 1, 9]);
deleteNode(deleted2.next.next);
console.log("5:", listToArray(deleted2));

console.log("6:", listToArray(doubleIt(listFromArray([1, 8, 9]))));
console.log("6:", listToArray(doubleIt(listFromArray([9, 9, 9]))));

console.log(
  "7:",
  listToArray(
    mergeKLists([
      listFromArray([1, 4, 5]),
      listFromArray([1, 3, 4]),
      listFromArray([2, 6]),
    ]),
  ),
);
console.log("7:", listToArray(mergeKLists([])));
console.log("7:", listToArray(mergeKLists([null])));

console.log(
  "8:",
  listToArray(reverseKGroup(listFromArray([1, 2, 3, 4, 5]), 2)),
);
console.log(
  "8:",
  listToArray(reverseKGroup(listFromArray([1, 2, 3, 4, 5]), 3)),
);

console.log("9:", listToArray(partition(listFromArray([1, 4, 3, 2, 5, 2]), 3)));
console.log("9:", listToArray(partition(listFromArray([2, 1]), 2)));
