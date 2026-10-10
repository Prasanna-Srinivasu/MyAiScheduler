/**
 * Comprehensive Interview Concept Guides & Cheat Sheets
 * Designed for candidates preparing for top tech & Java backend engineering interviews.
 */

export const interviewConceptGuides = {
  // ==========================================
  // DSA CONCEPTS
  // ==========================================
  Arrays: {
    title: 'Arrays & Subarray Algorithms Masterclass',
    subtitle: 'The foundational data structure asked in >85% of software engineering interviews.',
    technology: 'DSA',
    tagline: 'Contiguous memory, cache locality, and in-place pointer manipulation.',
    keyConcepts: [
      'Contiguous memory layout provides O(1) random access by index.',
      'In-place modifications (O(1) extra space) are heavily favored by interviewers over auxiliary arrays.',
      'Subarray vs Subsequence: Subarrays are contiguous blocks; subsequences maintain relative order but can skip elements.',
    ],
    whenToUse: [
      {
        method: 'Two Pointers',
        signal: 'Array is sorted, or problem asks for pairs/triplets with target sum, palindrome verification, or in-place partition.',
        complexity: 'O(n) Time | O(1) Space',
      },
      {
        method: 'Sliding Window',
        signal: 'Problem asks for longest/shortest contiguous subarray matching a condition (e.g., sum >= K, distinct elements).',
        complexity: 'O(n) Time | O(1) Space (or O(k) for window map)',
      },
      {
        method: "Kadane's Algorithm",
        signal: 'Problem asks for maximum sum contiguous subarray with mixed positive and negative numbers.',
        complexity: 'O(n) Time | O(1) Space',
      },
      {
        method: 'Cyclic Sort',
        signal: 'Array elements are in range [1..n] or [0..n] and you need to find missing or duplicate numbers in O(n) time and O(1) space.',
        complexity: 'O(n) Time | O(1) Space',
      },
      {
        method: 'Dutch National Flag (3-Way Partition)',
        signal: 'Array contains 3 distinct categories or colors (e.g. 0, 1, 2) that must be sorted in a single pass.',
        complexity: 'O(n) Time | O(1) Space',
      },
      {
        method: 'Prefix Sum & HashMap',
        signal: 'Frequent range sum queries or finding count of subarrays whose sum equals K in unsorted arrays.',
        complexity: 'O(n) Time | O(n) Space',
      },
    ],
    templateCode: `// 1. Two Pointers Pattern (e.g. Two Sum Sorted, Reverse, In-place Remove)
public int[] twoPointersTemplate(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return new int[]{left, right};
        else if (sum < target) left++;
        else right--;
    }
    return new int[]{-1, -1};
}

// 2. Sliding Window Template (Dynamic Window)
public int slidingWindowTemplate(int[] nums, int target) {
    int left = 0, currentSum = 0, minLen = Integer.MAX_VALUE;
    for (int right = 0; right < nums.length; right++) {
        currentSum += nums[right];
        while (currentSum >= target) {
            minLen = Math.min(minLen, right - left + 1);
            currentSum -= nums[left++];
        }
    }
    return minLen == Integer.MAX_VALUE ? 0 : minLen;
}

// 3. Kadane's Algorithm Template (Max Subarray Sum)
public int maxSubArray(int[] nums) {
    int currentSum = nums[0];
    int maxSum = nums[0];
    for (int i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    return maxSum;
}`,
    pitfalls: [
      'Off-by-one errors: Double check loop bounds (left < right vs left <= right).',
      'Negative numbers in Kadane\'s: Initialize currentSum and maxSum to nums[0], NOT 0 (array might be all negative!).',
      'Midpoint overflow: When calculating mid, always use left + (right - left) / 2 rather than (left + right) / 2.',
      'Duplicates: When skipping duplicate pairs in 3Sum, remember to skip while left < right && nums[left] == nums[left+1].',
    ],
    interviewChecklist: [
      'Ask: Is the array sorted? Can it contain negative numbers or zero?',
      'Ask: Are duplicates permitted in the answer? Can the array be mutated in-place?',
      'State brute force complexity first (e.g., O(n²) nested loops).',
      'Explain why Two Pointers or Sliding Window optimizes it to O(n) time.',
      'Dry run an edge case: empty array, single element, all identical elements.',
    ],
  },

  Strings: {
    title: 'Strings & Character Manipulation',
    subtitle: 'Crucial for string parsing, pattern matching, anagrams, and palindromes.',
    technology: 'DSA',
    tagline: 'Immutability in Java, frequency arrays, and window expansion.',
    keyConcepts: [
      'Java String objects are immutable; frequent string concatenations create O(n²) garbage. Always use StringBuilder.',
      'ASCII / Alphabet frequency arrays: int[26] or int[128] are faster and use less memory than HashMap<Character, Integer>.',
      'Palindromes can be expanded outward from the center (2n - 1 centers) or checked inward with Two Pointers.',
    ],
    whenToUse: [
      {
        method: 'Frequency Array (int[26])',
        signal: 'Valid Anagrams, Group Anagrams, checking character counts.',
        complexity: 'O(n) Time | O(1) Space (size 26 is constant)',
      },
      {
        method: 'Two Pointers (Inward / Outward)',
        signal: 'Valid Palindrome, Longest Palindromic Substring, reversing vowels.',
        complexity: 'O(n) Time | O(1) Space',
      },
      {
        method: 'Sliding Window + Set/Map',
        signal: 'Longest Substring Without Repeating Characters, Minimum Window Substring.',
        complexity: 'O(n) Time | O(k) Space',
      },
    ],
    templateCode: `// Frequency Array Pattern
public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] freq = new int[26];
    for (int i = 0; i < s.length(); i++) {
        freq[s.charAt(i) - 'a']++;
        freq[t.charAt(i) - 'a']--;
    }
    for (int count : freq) {
        if (count != 0) return false;
    }
    return true;
}`,
    pitfalls: [
      'Using s.substring() in a tight loop creates multiple string instances.',
      'Forgetting case insensitivity or non-alphanumeric characters (e.g. Character.isLetterOrDigit()).',
      'Unicode vs ASCII: Clarify if characters are strictly lowercase English (26 letters) or full UTF-8.',
    ],
    interviewChecklist: [
      'Ask: Are the strings ASCII or Unicode? Is matching case-sensitive?',
      'Ask: Can the string contain spaces and special characters?',
      'Mention StringBuilder for mutable building to save heap allocations.',
    ],
  },

  'Linked Lists': {
    title: 'Linked Lists & Pointer Reversals',
    subtitle: 'Tests memory pointers, reference updates, and recursion mechanics.',
    technology: 'DSA',
    tagline: 'Dummy heads, Fast & Slow pointers (Floyd\'s Cycle), and pointer rewiring.',
    keyConcepts: [
      'Sentinel / Dummy Head node eliminates special-case handling for the head node.',
      'Floyd\'s Cycle Finding: Fast pointer moves 2 steps, slow pointer moves 1 step.',
      'In-place Reversal: Maintain prev, curr, and next pointers.',
    ],
    whenToUse: [
      {
        method: 'Fast & Slow Pointers',
        signal: 'Detect cycle, find middle node, or find k-th node from end in a single pass.',
        complexity: 'O(n) Time | O(1) Space',
      },
      {
        method: 'Dummy Head Sentinel',
        signal: 'Merging two lists, removing elements, or building a new list.',
        complexity: 'O(n) Time | O(1) Space',
      },
      {
        method: 'Iterative Pointer Reversal',
        signal: 'Reverse entire list or reverse nodes in k-groups.',
        complexity: 'O(n) Time | O(1) Space',
      },
    ],
    templateCode: `// 1. In-place Reverse Linked List
public ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}

// 2. Fast & Slow Pointer (Middle & Cycle)
public ListNode findMiddle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}`,
    pitfalls: [
      'Losing the reference: Saving curr.next into nextTemp before rewiring curr.next is mandatory.',
      'NullPointerException on fast.next.next: Always verify while (fast != null && fast.next != null).',
      'Memory leak / cycle creation when reversing parts of a list.',
    ],
    interviewChecklist: [
      'Ask: Can the list contain cycles? Can the head be null?',
      'Introduce a dummy node: ListNode dummy = new ListNode(0); dummy.next = head;',
      'Draw the pointer arrows on a whiteboard before writing code.',
    ],
  },

  'Stacks & Queues': {
    title: 'Stacks, Queues & Monotonic Structures',
    subtitle: 'LIFO & FIFO primitives, monotonic stacks for nearest smaller/greater elements.',
    technology: 'DSA',
    tagline: 'Parentheses matching, call stacks, BFS queues, and O(n) monotonic scans.',
    keyConcepts: [
      'Monotonic Stack: Keeps elements strictly increasing or decreasing; finds Next Greater Element in O(n).',
      'In Java, prefer ArrayDeque<T> over legacy java.util.Stack or LinkedList for high performance.',
      'Queue is essential for BFS level-order traversals.',
    ],
    whenToUse: [
      {
        method: 'Monotonic Stack',
        signal: 'Next Greater Element, Daily Temperatures, Largest Rectangle in Histogram, Trapping Rain Water.',
        complexity: 'O(n) Time | O(n) Space',
      },
      {
        method: 'Matching Stack',
        signal: 'Valid Parentheses, Evaluate Reverse Polish Notation, Min Stack.',
        complexity: 'O(n) Time | O(n) Space',
      },
    ],
    templateCode: `// Next Greater Element with Monotonic Stack
public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] result = new int[n];
    Deque<Integer> stack = new ArrayDeque<>(); // stores indices
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
            int prevIdx = stack.pop();
            result[prevIdx] = i - prevIdx;
        }
        stack.push(i);
    }
    return result;
}`,
    pitfalls: [
      'Using legacy java.util.Stack (which has synchronized overhead). Use Deque<Integer> stack = new ArrayDeque<>() instead.',
      'Forgetting to store indices instead of values when distance/width is needed (like Daily Temperatures).',
    ],
    interviewChecklist: [
      'Explain why monotonic stack processes each element at most twice (one push, one pop) -> O(n) total.',
      'Check empty stack before peek() or pop() to avoid EmptyStackException.',
    ],
  },

  'Trees & BST': {
    title: 'Trees, Binary Search Trees & Graph Traversals',
    subtitle: 'DFS (Pre, In, Post-order), BFS (Level-order), and BST invariant properties.',
    technology: 'DSA',
    tagline: 'Recursion trees, subtree invariants, and depth-first vs breadth-first exploration.',
    keyConcepts: [
      'BST Invariant: For any node N, all keys in left subtree < N.val < all keys in right subtree.',
      'In-order traversal of a valid BST always yields a strictly ascending sorted sequence.',
      'DFS uses implicit call stack (height h); BFS uses explicit Queue (width w).',
    ],
    whenToUse: [
      {
        method: 'DFS Recursion',
        signal: 'Maximum Depth, Invert Tree, Same Tree, Lowest Common Ancestor (LCA), Path Sum.',
        complexity: 'O(n) Time | O(h) Space (h = tree height)',
      },
      {
        method: 'BFS Queue (Level-Order)',
        signal: 'Level-order traversal, Zigzag traversal, Right Side View, Minimum Depth.',
        complexity: 'O(n) Time | O(w) Space (w = max width)',
      },
      {
        method: 'BST Range Validation',
        signal: 'Validate Binary Search Tree, Kth Smallest Element in BST.',
        complexity: 'O(n) Time | O(h) Space',
      },
    ],
    templateCode: `// 1. Validate BST using Range Bounds
public boolean isValidBST(TreeNode root) {
    return validate(root, null, null);
}
private boolean validate(TreeNode node, Integer low, Integer high) {
    if (node == null) return true;
    if ((low != null && node.val <= low) || (high != null && node.val >= high)) return false;
    return validate(node.left, low, node.val) && validate(node.right, node.val, high);
}

// 2. BFS Level Order Traversal
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        List<Integer> currentLevel = new ArrayList<>();
        for (int i = 0; i < levelSize; i++) {
            TreeNode curr = queue.poll();
            currentLevel.add(curr.val);
            if (curr.left != null) queue.offer(curr.left);
            if (curr.right != null) queue.offer(curr.right);
        }
        result.add(currentLevel);
    }
    return result;
}`,
    pitfalls: [
      'Checking only immediate children in BST (e.g. node.left.val < node.val is NOT sufficient; whole subtree must be valid!).',
      'Forgetting to freeze level size in BFS (int levelSize = queue.size()) before the loop.',
      'Integer.MIN_VALUE / MAX_VALUE boundary test cases: Use Long or null bounds to prevent comparison bugs.',
    ],
    interviewChecklist: [
      'Ask: Can tree nodes contain duplicate values? Can the tree be unbalanced (skewed like a linked list)?',
      'State time complexity: O(n) because every node is visited once.',
      'State space complexity: O(h) where h = O(log n) for balanced trees and O(n) for worst-case skewed trees.',
    ],
  },

  'Binary Search': {
    title: 'Binary Search & Monotonic Predicates',
    subtitle: 'Divide-and-conquer on sorted spaces and search space reduction.',
    technology: 'DSA',
    tagline: 'Logarithmic search O(log n), first/last occurrences, and search-on-answer.',
    keyConcepts: [
      'Binary Search works on ANY monotonically increasing/decreasing condition, not just sorted arrays.',
      'Binary Search on Answer: When you want to find min/max feasible value (e.g. Koko Eating Bananas, Capacity To Ship Packages).',
      'Strict loop termination: while (low <= high) vs while (low < high).',
    ],
    whenToUse: [
      {
        method: 'Standard Binary Search',
        signal: 'Find target in sorted array, Search in Rotated Sorted Array.',
        complexity: 'O(log n) Time | O(1) Space',
      },
      {
        method: 'First / Last Occurrence',
        signal: 'Find First and Last Position of Element in Sorted Array.',
        complexity: 'O(log n) Time | O(1) Space',
      },
      {
        method: 'Search on Answer (Monotonic Predicate)',
        signal: 'Min speed to eat bananas in H hours, split array largest sum.',
        complexity: 'O(n log(max - min)) Time | O(1) Space',
      },
    ],
    templateCode: `// Standard Clean Binary Search Template
public int search(int[] nums, int target) {
    int low = 0, high = nums.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
    pitfalls: [
      'Integer overflow with (low + high) / 2. Always write low + (high - low) / 2.',
      'Infinite loops: Ensure low moves to mid + 1 and high moves to mid - 1.',
      'Rotated sorted array: Identify which half is monotonically sorted before deciding which half to discard.',
    ],
    interviewChecklist: [
      'Highlight O(log n) efficiency: Even with 1 billion elements, only ~30 comparisons needed.',
      'Explicitly explain loop invariants to the interviewer.',
    ],
  },

  'Dynamic Programming': {
    title: 'Dynamic Programming & Memoization',
    subtitle: 'Overlapping subproblems + optimal substructure. 1D, 2D, and Knapsack variants.',
    technology: 'DSA',
    tagline: 'Transition state recurrence, top-down memoization vs bottom-up space optimization.',
    keyConcepts: [
      'Identify whether problem asks for optimal value (min/max), count of ways, or true/false feasibility.',
      'Define DP State: What does dp[i] or dp[i][j] represent in plain English?',
      'Base Cases: What are the smallest non-divisible subproblems (e.g. dp[0] = 0)?',
      'Space Optimization: If dp[i] only depends on dp[i-1] and dp[i-2], optimize O(n) space to O(1)!',
    ],
    whenToUse: [
      {
        method: '1D State Recurrence',
        signal: 'Climbing Stairs, House Robber, Coin Change, Word Break.',
        complexity: 'O(n) Time | O(n) or O(1) Space',
      },
      {
        method: '2D Grid / String DP',
        signal: 'Longest Common Subsequence (LCS), Edit Distance, Unique Paths.',
        complexity: 'O(m * n) Time | O(n) Space',
      },
      {
        method: '0/1 & Unbounded Knapsack',
        signal: 'Partition Equal Subset Sum, Target Sum, Coin Change.',
        complexity: 'O(n * W) Time | O(W) Space',
      },
    ],
    templateCode: `// 1. House Robber (1D DP with Space Optimization)
public int rob(int[] nums) {
    if (nums.length == 1) return nums[0];
    int prev2 = 0, prev1 = 0;
    for (int num : nums) {
        int current = Math.max(prev1, prev2 + num);
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}

// 2. Coin Change (Unbounded Knapsack)
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
    pitfalls: [
      'Jumping into DP table without stating recurrence relation first.',
      'Initializing with 0 when searching for minimum (use Integer.MAX_VALUE or amount + 1 to avoid overflow).',
      'Forgetting circular condition in House Robber II (solve for [0..n-2] and [1..n-1]).',
    ],
    interviewChecklist: [
      'Step 1: Write recursive brute force with recurrence formula.',
      'Step 2: Draw the subproblem tree and show redundant overlapping calculations.',
      'Step 3: Add memoization array (Top-Down).',
      'Step 4: Convert to iterative Bottom-Up table and optimize space.',
    ],
  },

  // ==========================================
  // JAVA CORE & BACKEND INTERVIEW CONCEPTS
  // ==========================================
  'Java OOP': {
    title: 'Java OOP, Design Patterns & Immutability',
    subtitle: 'The cornerstone of enterprise Java architecture and senior engineering interviews.',
    technology: 'Java',
    tagline: 'Defensive copying, thread-safe singletons, polymorphism, and solid principles.',
    keyConcepts: [
      'Immutability: class declared final, private final fields, no setters, and defensive copy of mutable objects (Date, List).',
      'Singleton Pattern: Double-checked locking requires volatile instance variable to prevent instruction reordering.',
      'Composition over Inheritance: Promotes loose coupling and easier testing.',
      'SOLID Principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.',
    ],
    whenToUse: [
      {
        method: 'Defensive Copying',
        signal: 'Interview asks: "How to make a class containing Date or List truly immutable?"',
        complexity: 'Safety guarantee: External mutation cannot alter internal object state.',
      },
      {
        method: 'Double-Checked Locking Singleton',
        signal: 'Interview asks for thread-safe lazy-loaded Singleton without performance degradation.',
        complexity: 'O(1) Access | 100% Thread-safe',
      },
      {
        method: 'Builder Pattern',
        signal: 'Constructing complex domain objects with multiple optional parameters.',
        complexity: 'Eliminates telescoping constructors; immutable once built.',
      },
    ],
    templateCode: `// 1. Truly Immutable Class with Defensive Copying
public final class ImmutablePerson {
    private final String name;
    private final List<String> skills;
    private final Date joinDate;

    public ImmutablePerson(String name, List<String> skills, Date joinDate) {
        this.name = name;
        // Defensive copy incoming mutable objects
        this.skills = skills != null ? new ArrayList<>(skills) : Collections.emptyList();
        this.joinDate = joinDate != null ? new Date(joinDate.getTime()) : null;
    }

    public String getName() { return name; }
    // Return unmodifiable view or defensive clone
    public List<String> getSkills() { return Collections.unmodifiableList(skills); }
    public Date getJoinDate() { return joinDate != null ? new Date(joinDate.getTime()) : null; }
}

// 2. Thread-Safe Singleton with Double-Checked Locking
public class SafeSingleton {
    private static volatile SafeSingleton instance;
    private SafeSingleton() {}

    public static SafeSingleton getInstance() {
        if (instance == null) {
            synchronized (SafeSingleton.class) {
                if (instance == null) {
                    instance = new SafeSingleton();
                }
            }
        }
        return instance;
    }
}`,
    pitfalls: [
      'Missing volatile on Singleton instance: causes thread to see partially constructed object due to CPU instruction reordering.',
      'Returning raw mutable collection references from getter in an immutable class.',
      'Cloneable interface in Java is broken (shallow copy by default, throws CloneNotSupportedException); prefer Copy Constructors.',
    ],
    interviewChecklist: [
      'Explain WHY volatile is mandatory in double-checked locking (JMM happens-before relationship).',
      'Explain the difference between final reference and immutable object (final List can still have items added!).',
      'Mention Bill Pugh static holder class as the cleanest Singleton alternative.',
    ],
  },

  'Java Collections': {
    title: 'Java Collections Framework Deep Dive',
    subtitle: 'HashMap bucket arrays, treeification, equals/hashCode contract, and LRU Cache.',
    technology: 'Java',
    tagline: 'Under-the-hood architecture of Map, List, Set, Queue, and concurrent variants.',
    keyConcepts: [
      'HashMap Internals: Array of Node<K,V> buckets, hash spreading, index = (n - 1) & hash.',
      'Treeification: When a bucket reaches TREEIFY_THRESHOLD (8 items) and table capacity >= 64, linked list converts to Red-Black tree (O(log n)).',
      'equals() & hashCode() Contract: If two objects are equal by equals(), they MUST have identical hashCode(). If violated, HashMap cannot retrieve the key.',
      'ConcurrentHashMap: Uses CAS (Compare-And-Swap) for empty bucket slots and synchronized lock only on bucket head; no global lock.',
    ],
    whenToUse: [
      {
        method: 'LinkedHashMap LRU Override',
        signal: 'Interview asks: "Implement an O(1) Least Recently Used (LRU) Cache in Java."',
        complexity: 'O(1) get() | O(1) put()',
      },
      {
        method: 'Custom Comparable & Comparator',
        signal: 'Sorting objects by multiple fields (e.g. Dept asc, Salary desc, Name asc).',
        complexity: 'O(n log n) TimSort',
      },
      {
        method: 'BoundedBlockingQueue (Locks & Conditions)',
        signal: 'Thread-safe bounded queue with blocking put() and take() without ConcurrentLinkedQueue.',
        complexity: 'Thread-safe FIFO with ReentrantLock and Condition variables',
      },
    ],
    templateCode: `// 1. LRU Cache using LinkedHashMap
public class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;

    public LRUCache(int capacity) {
        // accessOrder = true ensures access order rather than insertion order
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }
}

// 2. Chained Multi-Field Comparator
Comparator<Employee> multiComp = Comparator
    .comparing(Employee::getDepartment)
    .thenComparing(Employee::getSalary, Comparator.reverseOrder())
    .thenComparing(Employee::getName);`,
    pitfalls: [
      'Overriding equals() without overriding hashCode(): Leads to duplicate keys in HashSet and HashMap.',
      'Using mutable objects as HashMap keys: If key field changes after insertion, its hash code changes and key is lost forever in table.',
      'Modifying collections during enhanced for-loop throws ConcurrentModificationException (use Iterator.remove()).',
    ],
    interviewChecklist: [
      'Explain what happens during HashMap collision resolution (linked list -> red-black tree).',
      'State default load factor (0.75) and why (optimal trade-off between time and space).',
      'Explain difference between SynchronizedMap (table-level lock) and ConcurrentHashMap (bucket-level stripe).',
    ],
  },

  'Java Streams': {
    title: 'Java 8+ Streams API & Functional Pipelines',
    subtitle: 'Declarative pipelines, intermediate vs terminal operations, and parallel streams.',
    technology: 'Java',
    tagline: 'Map-filter-reduce, Collectors.groupingBy, IntStream, and performance implications.',
    keyConcepts: [
      'Streams are lazy: Intermediate operations (filter, map, flatMap) do not execute until a terminal operation (collect, count) is called.',
      'Streams cannot be reused once traversed; attempting to do so throws IllegalStateException.',
      'Parallel Streams use the shared ForkJoinPool.commonPool(). Avoid running blocking I/O tasks inside parallel streams.',
    ],
    whenToUse: [
      {
        method: 'Collectors.groupingBy',
        signal: 'Group items by attribute, compute group counts, averages, or max values.',
        complexity: 'O(n) single declarative pass',
      },
      {
        method: 'IntStream & Character Frequency',
        signal: 'Find first non-repeating character, character histogram, sum of squares.',
        complexity: 'O(n) Memory efficient',
      },
      {
        method: 'flatMap',
        signal: 'Flattening List<List<T>> into List<T> or one-to-many relationship mapping.',
        complexity: 'O(total elements)',
      },
    ],
    templateCode: `// 1. Grouping and Computing Statistics
Map<String, DoubleSummaryStatistics> salaryStatsByDept = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getDepartment,
        Collectors.summarizingDouble(Employee::getSalary)
    ));

// 2. First Non-Repeating Character with Streams
public Character firstUniqChar(String s) {
    Map<Character, Long> freq = s.chars()
        .mapToObj(c -> (char) c)
        .collect(Collectors.groupingBy(
            Function.identity(),
            LinkedHashMap::new, // preserves encounter order
            Collectors.counting()
        ));

    return freq.entrySet().stream()
        .filter(e -> e.getValue() == 1L)
        .map(Map.Entry::getKey)
        .findFirst()
        .orElse(null);
}`,
    pitfalls: [
      'Calling .parallel() carelessly: Thread-hopping and synchronization overhead make it slower than sequential for small collections (< 10,000 items).',
      'Modifying external state inside .forEach(): Functional pipelines must be stateless and free of side effects.',
    ],
    interviewChecklist: [
      'Distinguish intermediate (lazy, return Stream<T>) vs terminal (eager, produce result or void).',
      'Explain why LinkedHashMap::new is passed to groupingBy when encounter order matters.',
    ],
  },

  'Java Concurrency': {
    title: 'Java Concurrency & Multithreading',
    subtitle: 'The ultimate senior Java interview filter: Locks, Conditions, JMM, and CompletableFuture.',
    technology: 'Java',
    tagline: 'Thread synchronization, wait/notify, ReentrantLock, ExecutorService, and deadlocks.',
    keyConcepts: [
      'Java Memory Model (JMM): Guarantees happens-before relationships, visibility (volatile), and atomicity (synchronized / AtomicInteger).',
      'Spurious Wakeups: Always check waiting conditions inside a while loop, never an if statement: while (!condition) { wait(); }.',
      'ReentrantLock vs synchronized: ReentrantLock offers fairness, tryLock with timeout, interruptible locking, and multiple Condition variables.',
      'Deadlock Prevention: Always acquire multiple locks in a globally consistent order across all threads.',
    ],
    whenToUse: [
      {
        method: 'wait() and notify()',
        signal: 'Classic thread coordination, printing alternating numbers across 2 threads.',
        complexity: 'Object monitor lock',
      },
      {
        method: 'ReentrantLock & Condition',
        signal: 'Bounded Producer-Consumer buffer with notFull and notEmpty condition queues.',
        complexity: 'Explicit fine-grained locking',
      },
      {
        method: 'CompletableFuture.allOf()',
        signal: 'Asynchronously call multiple microservices or database queries concurrently and aggregate results.',
        complexity: 'Non-blocking reactive I/O',
      },
    ],
    templateCode: `// Producer-Consumer Buffer with ReentrantLock & Conditions
public class BoundedBuffer<T> {
    private final Object[] items = new Object[10];
    private int count, putptr, takeptr;
    private final Lock lock = new ReentrantLock();
    private final Condition notFull  = lock.newCondition();
    private final Condition notEmpty = lock.newCondition();

    public void put(T x) throws InterruptedException {
        lock.lock();
        try {
            while (count == items.length) notFull.await(); // wait while full
            items[putptr] = x;
            if (++putptr == items.length) putptr = 0;
            count++;
            notEmpty.signal(); // wake up consumers
        } finally {
            lock.unlock();
        }
    }

    @SuppressWarnings("unchecked")
    public T take() throws InterruptedException {
        lock.lock();
        try {
            while (count == 0) notEmpty.await(); // wait while empty
            T x = (T) items[takeptr];
            if (++takeptr == items.length) takeptr = 0;
            count--;
            notFull.signal(); // wake up producers
            return x;
        } finally {
            lock.unlock();
        }
    }
}`,
    pitfalls: [
      'Missing finally { lock.unlock(); }: If an exception occurs, lock is held forever, halting the system.',
      'Using notify() instead of notifyAll() when multiple thread types are waiting: can lead to lost signals and system freeze.',
      'Volatile keyword guarantees visibility, NOT atomicity (e.g. count++ is 3 separate CPU operations and NOT thread-safe).',
    ],
    interviewChecklist: [
      'Explain the 4 Coffman conditions for Deadlock (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait).',
      'Explain how global lock ordering breaks circular wait to eliminate deadlocks.',
      'Demonstrate how CompletableFuture handles exceptions with .exceptionally() and .handle().',
    ],
  },

  'Java JVM & Memory': {
    title: 'JVM Architecture, Memory & Garbage Collection',
    subtitle: 'Heap vs Stack, Metaspace, GC algorithms, and troubleshooting OutOfMemoryErrors.',
    technology: 'Java',
    tagline: 'Young/Old generation, GC Roots, String Deduplication, and thread dump triage.',
    keyConcepts: [
      'Heap Memory: Shared across all threads; stores objects and instance variables. Divided into Young (Eden, S0, S1) and Old Generation.',
      'Stack Memory: Per-thread memory; stores primitive local variables and method call stack frames. Fast allocation, freed on method exit.',
      'Metaspace: Native memory replacing PermGen in Java 8+; stores class metadata, method bytecode, and static variables.',
      'Garbage Collection Roots: Active thread stacks, static references, JNI references. Anything unreachable from GC Roots is garbage.',
    ],
    whenToUse: [
      {
        method: 'String.intern() & String Pool',
        signal: 'Interview asks: "Difference between String s = \"hello\" and new String(\"hello\")?"',
        complexity: 'Pool deduplication in Heap',
      },
      {
        method: 'Heap Dump Triage',
        signal: 'Diagnosing java.lang.OutOfMemoryError: Java heap space using Eclipse MAT or VisualVM.',
        complexity: 'Production troubleshooting',
      },
    ],
    templateCode: `// String Pool Interning Demonstration
String s1 = "Java"; // Stored in String Constant Pool
String s2 = new String("Java"); // Stored as new Object in regular Heap

System.out.println(s1 == s2); // false (different memory references)
System.out.println(s1 == s2.intern()); // true (intern() returns pool canonical reference)
System.out.println(s1.equals(s2)); // true (compares character content)`,
    pitfalls: [
      'Confusing OutOfMemoryError: Java heap space (heap leak) with OutOfMemoryError: Metaspace (classloader leak).',
      'Calling System.gc(): It is only a non-guaranteed hint to the JVM and can trigger expensive Full GC stop-the-world pauses in production.',
    ],
    interviewChecklist: [
      'Name major GC collectors: G1GC (default), ZGC (ultra-low latency), Shenandoah.',
      'Describe Young GC: Live objects in Eden copied to Survivor (S0/S1); aged objects promoted to Tenured Old Gen.',
      'Explain the difference between Memory Leak and Memory Exhaustion in Java.',
    ],
  },
};

/**
 * Helper to get guide for a concept or return default
 */
export function getConceptGuide(conceptName) {
  if (!conceptName || conceptName === 'ALL') {
    return {
      title: 'Interview Preparation Master Playbook',
      subtitle: 'Targeted preparation system for Top Tech, Fintech, and Tier-1 Java Backend Interviews.',
      technology: 'ALL',
      tagline: 'Understand the concept -> Recognize the pattern -> Practice Easy to Hard -> Lock in with revision notes.',
      keyConcepts: [
        'Interviews evaluate 3 traits: Problem Solving (pattern recognition), Code Quality (clean, modular, edge cases), and Communication (explaining your thought process).',
        'Always communicate your approach BEFORE writing code: Clarify -> Brute Force -> Optimal Intuition -> Code -> Dry Run.',
        'Organize your practice by Pattern and Concept rather than random solving for 10x faster pattern retention.',
      ],
      whenToUse: [
        {
          method: 'Step 1: Concept Mastery',
          signal: 'Select any Concept pill above (e.g. Arrays, Java Concurrency, Linked Lists) to read its interview playbook & template.',
          complexity: '2-minute read',
        },
        {
          method: 'Step 2: Method Drill-down',
          signal: 'Under Arrays, click specific method chips (Two Pointers, Sliding Window, Kadane\'s) to see only problems using that technique.',
          complexity: '10 problems per model',
        },
        {
          method: 'Step 3: Easy to Hard Progression',
          signal: 'Start with Easy problems to lock in the template, then Mediums (the core interview difficulty), then Hard for senior roles.',
          complexity: 'Gradual ramp-up',
        },
        {
          method: 'Step 4: Flashcards & Revision',
          signal: 'Write your intuition and edge cases in the "Notes" modal and mark tricky problems as "Needs Revision" for your final interview prep.',
          complexity: 'Spaced Repetition',
        },
      ],
      templateCode: `// The 5-Step Tech Interview Blueprint:
// 1. Clarify: Ask inputs, constraints, edge cases (empty, negative, null).
// 2. Brute Force: Mention O(n^2) or O(2^n) solution and explain why it is suboptimal.
// 3. Optimal Blueprint: Identify the pattern (e.g. Two Pointers / Sliding Window).
// 4. Implement: Write clean, readable Java code with clear variable names.
// 5. Verify & Test: Dry-run with an example and test corner cases (size 0, size 1).`,
      pitfalls: [
        'Starting to code immediately without speaking: Red flag for interviewers!',
        'Not checking constraints: 10^5 elements means an O(n^2) solution will Time Out (TLE). Must be O(n) or O(n log n).',
        'Not handling edge cases: Null inputs, empty collections, single elements, integer overflow.',
      ],
      interviewChecklist: [
        'Ask about constraints: Array size (n <= 10^5 implies O(n) or O(n log n); n <= 20 implies Backtracking / Bitmask).',
        'Think out loud: Let the interviewer hear your trade-off analysis.',
        'Keep your solution modular and testable.',
      ],
    };
  }

  return interviewConceptGuides[conceptName] || {
    title: `${conceptName} Interview Preparation Guide`,
    subtitle: `Core concepts, algorithmic patterns, and interview strategies for ${conceptName}.`,
    technology: conceptName.toLowerCase().startsWith('java') ? 'Java' : 'DSA',
    tagline: 'Master the fundamental patterns and edge cases tested in tech interviews.',
    keyConcepts: [
      `Understand how ${conceptName} operates in memory and runtime.`,
      'Recognize interview problem triggers and match them to optimal patterns.',
      'Practice handling edge cases, boundary conditions, and scalability.',
    ],
    whenToUse: [
      {
        method: 'Optimal Approach',
        signal: `Select problems under ${conceptName} to master all patterns from Easy to Hard.`,
        complexity: 'Optimal Time & Space',
      },
    ],
    templateCode: `// Interview Blueprint for ${conceptName}
// Review problem statement, analyze constraints, and apply the canonical pattern.`,
    pitfalls: [
      'Premature coding before clarifying constraints.',
      'Ignoring boundary conditions and potential null pointer or off-by-one errors.',
    ],
    interviewChecklist: [
      'Clarify constraints and expected edge cases.',
      'State time and space complexity before coding.',
    ],
  };
}

/**
 * Returns specific interview hint, clarifying questions, and optimal strategy for a problem
 */
export function getProblemInterviewWalkthrough(problem) {
  if (!problem) return null;

  const title = problem.title || '';
  const pattern = problem.pattern || problem.method || 'General';
  const concept = problem.concept || 'Data Structures';
  const difficulty = problem.difficulty || 'Medium';

  return {
    title,
    difficulty,
    concept,
    pattern,
    companies: problem.companies ? problem.companies.split(',').map((c) => c.trim()) : [],
    clarifyingQuestions: [
      'Can the input contain duplicate values or negative numbers?',
      'Is the array or collection guaranteed to be non-empty?',
      'Are we looking for in-place modification (O(1) auxiliary space) or can we allocate new memory?',
      'If multiple valid answers exist, does the return order matter?',
    ],
    bruteForceApproach: {
      explanation:
        'A naive brute-force approach typically checks every combination using nested loops or full recursive permutations.',
      timeComplexity: 'O(n²) or O(2ⁿ)',
      spaceComplexity: 'O(1) or O(n)',
      whySuboptimal:
        'With input sizes up to 10⁵, an O(n²) solution performs ~10¹⁰ operations, causing Time Limit Exceeded (TLE) in interviews.',
    },
    optimalStrategy: {
      patternUsed: pattern,
      keyIntuition:
        problem.description ||
        `Leverage ${pattern} to process elements in a single or logarithmic pass, avoiding redundant recalculations.`,
      timeComplexity:
        pattern.includes('Two Pointers') || pattern.includes('Sliding Window') || pattern.includes('Kadane')
          ? 'O(n) - Single pass through data'
          : pattern.includes('Binary Search')
          ? 'O(log n) - Halving search space'
          : pattern.includes('Tree') || pattern.includes('Graph')
          ? 'O(V + E) or O(N) - Visiting each node once'
          : 'O(n) optimal time',
      spaceComplexity:
        pattern.includes('Two Pointers') || pattern.includes('Kadane')
          ? 'O(1) - Constant auxiliary space'
          : 'O(k) or O(n) auxiliary space',
    },
    interviewEdgeCases: [
      'Empty input (size 0) or single element (size 1).',
      'All elements are identical (e.g. [1, 1, 1, 1]).',
      'All elements are negative (vital for maximum sum problems).',
      'Integer overflow when computing mid or cumulative sums.',
    ],
  };
}
