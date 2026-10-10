package com.example.backend.config;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.backend.entity.Course;
import com.example.backend.entity.PracticeProblem;
import com.example.backend.entity.Subtopic;
import com.example.backend.entity.Topic;
import com.example.backend.repository.CourseRepository;
import com.example.backend.repository.PracticeProblemRepository;
import com.example.backend.repository.SubtopicRepository;
import com.example.backend.repository.TopicRepository;

@Component
public class RoadmapAndProblemSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(RoadmapAndProblemSeeder.class);

    private final CourseRepository courseRepository;
    private final TopicRepository topicRepository;
    private final SubtopicRepository subtopicRepository;
    private final PracticeProblemRepository practiceProblemRepository;

    public RoadmapAndProblemSeeder(
            CourseRepository courseRepository,
            TopicRepository topicRepository,
            SubtopicRepository subtopicRepository,
            PracticeProblemRepository practiceProblemRepository) {
        this.courseRepository = courseRepository;
        this.topicRepository = topicRepository;
        this.subtopicRepository = subtopicRepository;
        this.practiceProblemRepository = practiceProblemRepository;
    }

    @Override
    public void run(String... args) {
        seedPracticeProblems();
        seedRoadmapCourses();
    }

    private void seedPracticeProblems() {
        log.info("Checking and seeding concept-based problems (DSA Arrays all patterns, and Java concepts)...");

        // 1. ARRAYS CONCEPT (All Patterns & Important Methods, Sorted Easy to Hard)
        // Arrays Easy
        upsert("Two Pointers", "Remove Duplicates from Sorted Array", 26, "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", "Easy", "DSA", "Microsoft, Amazon", "Remove duplicates in-place and return unique count.", "Arrays", "Two Pointers");
        upsert("Two Pointers", "Move Zeroes", 283, "https://leetcode.com/problems/move-zeroes/", "Easy", "DSA", "Meta, Apple", "Move all 0s to end while maintaining relative order.", "Arrays", "Two Pointers");
        upsert("Two Pointers", "Squares of a Sorted Array", 977, "https://leetcode.com/problems/squares-of-a-sorted-array/", "Easy", "DSA", "Meta, Amazon", "Square each number and return sorted array in O(n) using two pointers.", "Arrays", "Two Pointers");
        upsert("Arrays & Hashing", "Two Sum", 1, "https://leetcode.com/problems/two-sum/", "Easy", "DSA", "Google, Amazon, Meta", "Find two numbers in array that add up to target.", "Arrays", "Hash Map & Frequency");
        upsert("Arrays & Hashing", "Contains Duplicate", 217, "https://leetcode.com/problems/contains-duplicate/", "Easy", "DSA", "Microsoft, Apple", "Check if array contains any duplicates using HashSet.", "Arrays", "Hash Map & Frequency");
        upsert("Prefix Sum", "Running Sum of 1d Array", 1480, "https://leetcode.com/problems/running-sum-of-1d-array/", "Easy", "DSA", "Google, Apple", "Running sum of array where runningSum[i] = sum(nums[0]…nums[i]).", "Arrays", "Prefix Sum");
        upsert("Prefix Sum", "Range Sum Query - Immutable", 303, "https://leetcode.com/problems/range-sum-query-immutable/", "Easy", "DSA", "Amazon, Meta", "Calculate sum of elements between indices left and right in O(1) query time.", "Arrays", "Prefix Sum");
        upsert("Kadane's Algorithm", "Maximum Subarray", 53, "https://leetcode.com/problems/maximum-subarray/", "Easy", "DSA", "Amazon, Apple, Microsoft", "Find subarray with largest sum using Kadane's Algorithm in O(n).", "Arrays", "Kadane's Algorithm");
        upsert("Cyclic Sort", "Missing Number", 268, "https://leetcode.com/problems/missing-number/", "Easy", "DSA", "Amazon, Microsoft", "Find only number in range [0, n] missing from array.", "Arrays", "Cyclic Sort");
        upsert("Cyclic Sort", "Find All Numbers Disappeared in an Array", 448, "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/", "Easy", "DSA", "Google, Amazon", "Find all elements in [1, n] not in array without extra space in O(n).", "Arrays", "Cyclic Sort");
        upsert("Matrix", "Matrix Diagonal Sum", 1572, "https://leetcode.com/problems/matrix-diagonal-sum/", "Easy", "DSA", "Google, Amazon", "Return sum of matrix primary and secondary diagonals in one pass.", "Arrays", "Matrix Traversal");
        upsert("Intervals", "Meeting Rooms", 252, "https://leetcode.com/problems/meeting-rooms/", "Easy", "DSA", "Amazon, Meta", "Determine if person can attend all meetings.", "Arrays", "Interval Sorting");
        upsert("Sliding Window", "Best Time to Buy and Sell Stock", 121, "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", "Easy", "DSA", "Amazon, Apple", "Find maximum single buy-sell profit.", "Arrays", "Sliding Window");

        // Arrays Medium
        upsert("Two Pointers", "Two Sum II - Input Array Is Sorted", 167, "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", "Medium", "DSA", "Amazon, Google", "Find two elements that add to target in 1-indexed sorted array.", "Arrays", "Two Pointers");
        upsert("Two Pointers", "3Sum", 15, "https://leetcode.com/problems/3sum/", "Medium", "DSA", "Meta, Amazon, Google", "Find all unique triplets that sum to 0 using sorting and two pointers.", "Arrays", "Two Pointers");
        upsert("Two Pointers", "Container With Most Water", 11, "https://leetcode.com/problems/container-with-most-water/", "Medium", "DSA", "Amazon, Google", "Maximize water area between two vertical lines.", "Arrays", "Two Pointers");
        upsert("Two Pointers", "Sort Colors", 75, "https://leetcode.com/problems/sort-colors/", "Medium", "DSA", "Microsoft, Meta", "Sort array with red, white, blue (0, 1, 2) in-place (Dutch National Flag).", "Arrays", "Dutch National Flag");
        upsert("Two Pointers", "4Sum", 18, "https://leetcode.com/problems/4sum/", "Medium", "DSA", "Amazon, Google", "Find all unique quadruplets [a, b, c, d] that sum to target.", "Arrays", "Two Pointers");
        upsert("Two Pointers", "Boats to Save People", 881, "https://leetcode.com/problems/boats-to-save-people/", "Medium", "DSA", "Google, Amazon", "Minimum boats to rescue people given weight limit.", "Arrays", "Two Pointers");
        upsert("Sliding Window", "Minimum Size Subarray Sum", 209, "https://leetcode.com/problems/minimum-size-subarray-sum/", "Medium", "DSA", "Amazon, Microsoft", "Find minimal length of subarray whose sum >= target.", "Arrays", "Sliding Window");
        upsert("Sliding Window", "Max Consecutive Ones III", 1004, "https://leetcode.com/problems/max-consecutive-ones-iii/", "Medium", "DSA", "Meta, Google", "Find longest contiguous subarray of 1s flipping at most k zeros.", "Arrays", "Sliding Window");
        upsert("Prefix Sum", "Subarray Sum Equals K", 560, "https://leetcode.com/problems/subarray-sum-equals-k/", "Medium", "DSA", "Meta, Amazon", "Find total number of subarrays whose sum equals k using prefix sum & map.", "Arrays", "Prefix Sum & HashMap");
        upsert("Prefix Sum", "Product of Array Except Self", 238, "https://leetcode.com/problems/product-of-array-except-self/", "Medium", "DSA", "Amazon, Apple", "Compute prefix and postfix products in O(n) without division.", "Arrays", "Prefix & Suffix Products");
        upsert("Prefix Sum", "Continuous Subarray Sum", 523, "https://leetcode.com/problems/continuous-subarray-sum/", "Medium", "DSA", "Meta, Amazon", "Check for good subarray of length >= 2 whose sum is multiple of k.", "Arrays", "Prefix Sum & Modulo Hash");
        upsert("Kadane's Algorithm", "Maximum Product Subarray", 152, "https://leetcode.com/problems/maximum-product-subarray/", "Medium", "DSA", "Amazon, Google", "Find contiguous subarray with largest product.", "Arrays", "Kadane's Variant / DP");
        upsert("Cyclic Sort", "Find the Duplicate Number", 287, "https://leetcode.com/problems/find-the-duplicate-number/", "Medium", "DSA", "Microsoft, Amazon", "Find repeated number without modifying array and in O(1) space.", "Arrays", "Cyclic Sort");
        upsert("Cyclic Sort", "Find All Duplicates in an Array", 442, "https://leetcode.com/problems/find-all-duplicates-in-an-array/", "Medium", "DSA", "Amazon, Google", "Find all integers appearing twice in [1, n] in O(n) and O(1) extra space.", "Arrays", "Cyclic Sort");
        upsert("Matrix", "Rotate Image", 48, "https://leetcode.com/problems/rotate-image/", "Medium", "DSA", "Amazon, Microsoft", "Rotate n x n 2D matrix clockwise by 90 degrees in-place.", "Arrays", "In-Place Matrix Rotation");
        upsert("Matrix", "Spiral Matrix", 54, "https://leetcode.com/problems/spiral-matrix/", "Medium", "DSA", "Microsoft, Apple", "Return all elements of matrix in spiral order.", "Arrays", "Boundary Simulation");
        upsert("Matrix", "Set Matrix Zeroes", 73, "https://leetcode.com/problems/set-matrix-zeroes/", "Medium", "DSA", "Meta, Amazon", "If element is 0, set its entire row and column to 0 in-place in O(1) space.", "Arrays", "In-Place Markers");
        upsert("Matrix", "Search a 2D Matrix", 74, "https://leetcode.com/problems/search-a-2d-matrix/", "Medium", "DSA", "Amazon, Microsoft", "Search integer in m x n matrix with sorted rows.", "Arrays", "2D Binary Search");
        upsert("Intervals", "Merge Intervals", 56, "https://leetcode.com/problems/merge-intervals/", "Medium", "DSA", "Google, Amazon", "Merge all overlapping intervals.", "Arrays", "Interval Merging");
        upsert("Intervals", "Insert Interval", 57, "https://leetcode.com/problems/insert-interval/", "Medium", "DSA", "Google, Amazon", "Insert new interval into sorted non-overlapping intervals.", "Arrays", "Interval Insertion");
        upsert("Intervals", "Non-overlapping Intervals", 435, "https://leetcode.com/problems/non-overlapping-intervals/", "Medium", "DSA", "Meta, Amazon", "Find minimum intervals to remove to make remainder non-overlapping.", "Arrays", "Interval Scheduling");

        // Arrays Hard
        upsert("Two Pointers", "Trapping Rain Water", 42, "https://leetcode.com/problems/trapping-rain-water/", "Hard", "DSA", "Google, Meta, Amazon", "Calculate trapped rain water using left/right maximum boundaries.", "Arrays", "Two Pointers");
        upsert("Sliding Window", "Sliding Window Maximum", 239, "https://leetcode.com/problems/sliding-window-maximum/", "Hard", "DSA", "Google, Amazon", "Find maximum in each sliding window of size k using monotonic deque.", "Arrays", "Monotonic Deque");
        upsert("Cyclic Sort", "First Missing Positive", 41, "https://leetcode.com/problems/first-missing-positive/", "Hard", "DSA", "Amazon, Google", "Find smallest missing positive integer in O(n) time and O(1) space.", "Arrays", "Cyclic Sort");
        upsert("Kadane's Algorithm", "Maximum Sum Circular Subarray", 918, "https://leetcode.com/problems/maximum-sum-circular-subarray/", "Hard", "DSA", "Amazon, Google", "Find maximum possible sum of non-empty subarray in circular array.", "Arrays", "Kadane's Algorithm");

        // 2. STRINGS CONCEPT
        upsert("Arrays & Hashing", "Valid Anagram", 242, "https://leetcode.com/problems/valid-anagram/", "Easy", "DSA", "Amazon, Apple", "Check if string s is an anagram of string t.", "Strings", "Anagram & Frequency");
        upsert("Two Pointers", "Valid Palindrome", 125, "https://leetcode.com/problems/valid-palindrome/", "Easy", "DSA", "Meta, Microsoft", "Check alphanumeric palindrome ignoring case.", "Strings", "Two Pointers");
        upsert("Arrays & Hashing", "Group Anagrams", 49, "https://leetcode.com/problems/group-anagrams/", "Medium", "DSA", "Amazon, Google", "Group array of strings into anagram lists.", "Strings", "String Hash & Bucket");
        upsert("Arrays & Hashing", "Longest Consecutive Sequence", 128, "https://leetcode.com/problems/longest-consecutive-sequence/", "Medium", "DSA", "Google, Microsoft", "Find longest sequence length using HashSet in O(n).", "Strings", "HashSet Sequence");
        upsert("Arrays & Hashing", "Encode and Decode Strings", 271, "https://leetcode.com/problems/encode-and-decode-strings/", "Medium", "DSA", "Meta, Google", "Design algorithm to encode list of strings to string and decode.", "Strings", "Delimited Tokenization");
        upsert("Sliding Window", "Longest Substring Without Repeating Characters", 3, "https://leetcode.com/problems/longest-substring-without-repeating-characters/", "Medium", "DSA", "Amazon, Meta, Google", "Find length of longest substring without duplicates.", "Strings", "Sliding Window");
        upsert("Sliding Window", "Longest Repeating Character Replacement", 424, "https://leetcode.com/problems/longest-repeating-character-replacement/", "Medium", "DSA", "Google, Amazon", "Maximize length of identical characters with up to k replacements.", "Strings", "Frequency Window");
        upsert("Sliding Window", "Permutation in String", 567, "https://leetcode.com/problems/permutation-in-string/", "Medium", "DSA", "Microsoft, Meta", "Check if s2 contains a permutation of s1 using frequency window.", "Strings", "Fixed Window");
        upsert("Sliding Window", "Fruit Into Baskets", 904, "https://leetcode.com/problems/fruit-into-baskets/", "Medium", "DSA", "Google, Amazon", "Find longest subarray containing at most 2 distinct elements.", "Strings", "Sliding Window");
        upsert("Sliding Window", "Minimum Window Substring", 76, "https://leetcode.com/problems/minimum-window-substring/", "Hard", "DSA", "Meta, Google, Amazon", "Find smallest substring of s that contains every character of t.", "Strings", "Variable Window");
        upsert("Sliding Window", "Subarrays with K Different Integers", 992, "https://leetcode.com/problems/subarrays-with-k-different-integers/", "Hard", "DSA", "Amazon, Google", "Count number of good subarrays with exactly k distinct integers.", "Strings", "Variable Window");

        // 3. BINARY SEARCH CONCEPT
        upsert("Binary Search", "Binary Search", 704, "https://leetcode.com/problems/binary-search/", "Easy", "DSA", "Microsoft, Apple", "Search target in sorted array in O(log n) time.", "Binary Search", "Classic Binary Search");
        upsert("Binary Search", "First Bad Version", 278, "https://leetcode.com/problems/first-bad-version/", "Easy", "DSA", "Google, Amazon", "Find first defective version minimizing API calls.", "Binary Search", "Binary Search on Answer");
        upsert("Binary Search", "Koko Eating Bananas", 875, "https://leetcode.com/problems/koko-eating-bananas/", "Medium", "DSA", "Google, Meta", "Find minimum eating speed k to finish within h hours.", "Binary Search", "Binary Search on Answer");
        upsert("Binary Search", "Find Minimum in Rotated Sorted Array", 153, "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", "Medium", "DSA", "Amazon, Microsoft", "Find minimum element in rotated sorted array in O(log n).", "Binary Search", "Rotated Array Search");
        upsert("Binary Search", "Search in Rotated Sorted Array", 33, "https://leetcode.com/problems/search-in-rotated-sorted-array/", "Medium", "DSA", "Amazon, Meta, Google", "Find target index in rotated sorted array in O(log n).", "Binary Search", "Rotated Array Search");
        upsert("Binary Search", "Find Peak Element", 162, "https://leetcode.com/problems/find-peak-element/", "Medium", "DSA", "Meta, Google", "Find index of peak element strictly greater than neighbors.", "Binary Search", "Peak Detection");
        upsert("Binary Search", "Time Based Key-Value Store", 981, "https://leetcode.com/problems/time-based-key-value-store/", "Medium", "DSA", "Google, Netflix", "Design time-based key-value data structure supporting timestamp search.", "Binary Search", "Key-Value Binary Search");
        upsert("Binary Search", "Capacity To Ship Packages Within D Days", 1011, "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/", "Medium", "DSA", "Amazon, Google", "Find least weight capacity to ship all packages within d days.", "Binary Search", "Binary Search on Answer");
        upsert("Binary Search", "Median of Two Sorted Arrays", 4, "https://leetcode.com/problems/median-of-two-sorted-arrays/", "Hard", "DSA", "Google, Amazon, Meta", "Find median of two sorted arrays in O(log(m+n)) runtime.", "Binary Search", "Partition Binary Search");

        // 4. LINKED LISTS CONCEPT
        upsert("Linked Lists", "Reverse Linked List", 206, "https://leetcode.com/problems/reverse-linked-list/", "Easy", "DSA", "Amazon, Apple, Meta", "Reverse singly linked list iteratively and recursively.", "Linked Lists", "In-Place Reversal");
        upsert("Linked Lists", "Merge Two Sorted Lists", 21, "https://leetcode.com/problems/merge-two-sorted-lists/", "Easy", "DSA", "Amazon, Microsoft", "Splice together nodes of two sorted lists.", "Linked Lists", "List Splice");
        upsert("Linked Lists", "Linked List Cycle", 141, "https://leetcode.com/problems/linked-list-cycle/", "Easy", "DSA", "Microsoft, Amazon", "Detect cycle using Floyd's Tortoise and Hare algorithm.", "Linked Lists", "Floyd's Cycle");
        upsert("Linked Lists", "Reorder List", 143, "https://leetcode.com/problems/reorder-list/", "Medium", "DSA", "Meta, Amazon", "Reorder list L0 -> Ln -> L1 -> Ln-1.", "Linked Lists", "Split & Reverse");
        upsert("Linked Lists", "Remove Nth Node From End of List", 19, "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", "Medium", "DSA", "Meta, Google", "Remove nth node from end in one pass using two pointers.", "Linked Lists", "Two Pointers");
        upsert("Linked Lists", "Copy List with Random Pointer", 138, "https://leetcode.com/problems/copy-list-with-random-pointer/", "Medium", "DSA", "Amazon, Microsoft", "Deep copy list where nodes contain random pointer.", "Linked Lists", "Hash Map & Deep Copy");
        upsert("Linked Lists", "Add Two Numbers", 2, "https://leetcode.com/problems/add-two-numbers/", "Medium", "DSA", "Amazon, Google", "Add two numbers represented by linked lists in reverse order.", "Linked Lists", "Carry Simulation");
        upsert("Linked Lists", "Merge k Sorted Lists", 23, "https://leetcode.com/problems/merge-k-sorted-lists/", "Hard", "DSA", "Meta, Amazon, Google", "Merge k sorted linked lists using PriorityQueue in O(n log k).", "Linked Lists", "Priority Queue Merge");
        upsert("Linked Lists", "Reverse Nodes in k-Group", 25, "https://leetcode.com/problems/reverse-nodes-in-k-group/", "Hard", "DSA", "Microsoft, Amazon", "Reverse nodes of linked list k at a time.", "Linked Lists", "K-Group Reversal");

        // 5. STACKS & QUEUES CONCEPT
        upsert("Stacks & Queues", "Valid Parentheses", 20, "https://leetcode.com/problems/valid-parentheses/", "Easy", "DSA", "Amazon, Meta, Google", "Determine if input string brackets are valid.", "Stacks & Queues", "Parentheses Match");
        upsert("Stacks & Queues", "Next Greater Element I", 496, "https://leetcode.com/problems/next-greater-element-i/", "Easy", "DSA", "Amazon, Microsoft", "Find next greater element for elements in query array.", "Stacks & Queues", "Monotonic Stack");
        upsert("Stacks & Queues", "Min Stack", 155, "https://leetcode.com/problems/min-stack/", "Medium", "DSA", "Amazon, Bloomberg", "Design stack supporting push, pop, top, and getMin in O(1).", "Stacks & Queues", "Auxiliary Stack");
        upsert("Stacks & Queues", "Evaluate Reverse Polish Notation", 150, "https://leetcode.com/problems/evaluate-reverse-polish-notation/", "Medium", "DSA", "Google, Amazon", "Evaluate arithmetic expression in Reverse Polish Notation.", "Stacks & Queues", "Postfix Evaluation");
        upsert("Stacks & Queues", "Generate Parentheses", 22, "https://leetcode.com/problems/generate-parentheses/", "Medium", "DSA", "Meta, Amazon", "Generate all combinations of n pairs of valid parentheses.", "Stacks & Queues", "Backtracking Stack");
        upsert("Stacks & Queues", "Daily Temperatures", 739, "https://leetcode.com/problems/daily-temperatures/", "Medium", "DSA", "Meta, Google", "Calculate days to wait for warmer temperature using monotonic stack.", "Stacks & Queues", "Monotonic Stack");
        upsert("Stacks & Queues", "Car Fleet", 853, "https://leetcode.com/problems/car-fleet/", "Medium", "DSA", "Google, Amazon", "Calculate number of car fleets that arrive at destination.", "Stacks & Queues", "Monotonic Stack");
        upsert("Stacks & Queues", "Online Stock Span", 901, "https://leetcode.com/problems/online-stock-span/", "Medium", "DSA", "Amazon, Google", "Calculate consecutive days stock price was <= today's price.", "Stacks & Queues", "Monotonic Stack");
        upsert("Stacks & Queues", "Asteroid Collision", 735, "https://leetcode.com/problems/asteroid-collision/", "Medium", "DSA", "Amazon, Meta", "Find state of asteroids after all collisions.", "Stacks & Queues", "Collision Stack");
        upsert("Stacks & Queues", "Largest Rectangle in Histogram", 84, "https://leetcode.com/problems/largest-rectangle-in-histogram/", "Hard", "DSA", "Google, Meta", "Find area of largest rectangle in histogram using monotonic stack.", "Stacks & Queues", "Monotonic Stack");

        // 6. TREES & BST CONCEPT
        upsert("Trees & BST", "Invert Binary Tree", 226, "https://leetcode.com/problems/invert-binary-tree/", "Easy", "DSA", "Google, Amazon", "Invert binary tree recursively.", "Trees & BST", "DFS Traversal");
        upsert("Trees & BST", "Maximum Depth of Binary Tree", 104, "https://leetcode.com/problems/maximum-depth-of-binary-tree/", "Easy", "DSA", "Amazon, Microsoft", "Find number of nodes along longest path from root to leaf.", "Trees & BST", "DFS Depth");
        upsert("Trees & BST", "Diameter of Binary Tree", 543, "https://leetcode.com/problems/diameter-of-binary-tree/", "Easy", "DSA", "Meta, Amazon", "Find length of longest path between any two nodes in tree.", "Trees & BST", "Post-Order DFS");
        upsert("Trees & BST", "Balanced Binary Tree", 110, "https://leetcode.com/problems/balanced-binary-tree/", "Easy", "DSA", "Amazon, Google", "Determine if binary tree height-balanced.", "Trees & BST", "Bottom-Up DFS");
        upsert("Trees & BST", "Same Tree", 100, "https://leetcode.com/problems/same-tree/", "Easy", "DSA", "Microsoft, Amazon", "Check if two binary trees are structurally identical.", "Trees & BST", "Structural DFS");
        upsert("Trees & BST", "Subtree of Another Tree", 572, "https://leetcode.com/problems/subtree-of-another-tree/", "Easy", "DSA", "Meta, Amazon", "Check if tree contains subtree with identical structure and values.", "Trees & BST", "Subtree Check");
        upsert("Trees & BST", "Lowest Common Ancestor of a BST", 235, "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", "Medium", "DSA", "Amazon, Microsoft", "Find lowest common ancestor in Binary Search Tree.", "Trees & BST", "BST Properties");
        upsert("Trees & BST", "Binary Tree Level Order Traversal", 102, "https://leetcode.com/problems/binary-tree-level-order-traversal/", "Medium", "DSA", "Amazon, Meta", "Return level order traversal of nodes using BFS queue.", "Trees & BST", "BFS Level Order");
        upsert("Trees & BST", "Validate Binary Search Tree", 98, "https://leetcode.com/problems/validate-binary-search-tree/", "Medium", "DSA", "Amazon, Meta, Google", "Validate BST properties using low/high bounds.", "Trees & BST", "Range Validation");
        upsert("Trees & BST", "Kth Smallest Element in a BST", 230, "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", "Medium", "DSA", "Amazon, Google", "Find kth smallest element in BST using in-order traversal.", "Trees & BST", "In-Order Traversal");

        // 7. GRAPHS CONCEPT
        upsert("Graphs (BFS & DFS)", "Number of Islands", 200, "https://leetcode.com/problems/number-of-islands/", "Medium", "DSA", "Amazon, Google, Meta", "Count number of connected land components in 2D grid.", "Graphs", "Grid DFS");
        upsert("Graphs (BFS & DFS)", "Max Area of Island", 695, "https://leetcode.com/problems/max-area-of-island/", "Medium", "DSA", "Meta, Amazon", "Find maximum area of connected island in grid.", "Graphs", "Connected Component");
        upsert("Graphs (BFS & DFS)", "Clone Graph", 133, "https://leetcode.com/problems/clone-graph/", "Medium", "DSA", "Meta, Amazon", "Return deep copy of connected undirected graph.", "Graphs", "Graph Cloning");
        upsert("Graphs (BFS & DFS)", "Pacific Atlantic Water Flow", 417, "https://leetcode.com/problems/pacific-atlantic-water-flow/", "Medium", "DSA", "Google, Amazon", "Find grid coordinates where water flows to both oceans.", "Graphs", "Multi-Source DFS");
        upsert("Graphs (BFS & DFS)", "Surrounded Regions", 130, "https://leetcode.com/problems/surrounded-regions/", "Medium", "DSA", "Google, Amazon", "Capture regions surrounded by X using boundary DFS.", "Graphs", "Boundary DFS");
        upsert("Graphs (BFS & DFS)", "Rotting Oranges", 994, "https://leetcode.com/problems/rotting-oranges/", "Medium", "DSA", "Amazon, Microsoft", "Find minimum minutes until no fresh orange remains using multi-source BFS.", "Graphs", "Multi-Source BFS");
        upsert("Graphs (BFS & DFS)", "Course Schedule", 207, "https://leetcode.com/problems/course-schedule/", "Medium", "DSA", "Amazon, Google", "Detect cycle in directed graph using topological sort (Kahn's algorithm).", "Graphs", "Topological Sort");
        upsert("Graphs (BFS & DFS)", "Course Schedule II", 210, "https://leetcode.com/problems/course-schedule-ii/", "Medium", "DSA", "Amazon, Google", "Return ordering of courses using topological sort.", "Graphs", "Topological Sort");
        upsert("Graphs (BFS & DFS)", "Redundant Connection", 684, "https://leetcode.com/problems/redundant-connection/", "Medium", "DSA", "Google, Amazon", "Find edge that can be removed to turn graph into tree (Union Find).", "Graphs", "Union-Find Disjoint Set");
        upsert("Graphs (BFS & DFS)", "Word Ladder", 127, "https://leetcode.com/problems/word-ladder/", "Hard", "DSA", "Amazon, Meta, Google", "Find length of shortest transformation sequence using BFS.", "Graphs", "Shortest Path BFS");

        // 8. HEAPS CONCEPT
        upsert("Heaps & Priority Queue", "Kth Largest Element in a Stream", 703, "https://leetcode.com/problems/kth-largest-element-in-a-stream/", "Easy", "DSA", "Amazon, Google", "Design class to find kth largest element in stream using min-heap.", "Heaps", "Min-Heap Stream");
        upsert("Heaps & Priority Queue", "Last Stone Weight", 1046, "https://leetcode.com/problems/last-stone-weight/", "Easy", "DSA", "Amazon, Google", "Smash two heaviest stones together repeatedly using max-heap.", "Heaps", "Max-Heap");
        upsert("Heaps & Priority Queue", "Top K Frequent Elements", 347, "https://leetcode.com/problems/top-k-frequent-elements/", "Medium", "DSA", "Meta, Amazon", "Find k most frequent elements using bucket sort or heap.", "Heaps", "Top K Elements");
        upsert("Heaps & Priority Queue", "K Closest Points to Origin", 973, "https://leetcode.com/problems/k-closest-points-to-origin/", "Medium", "DSA", "Meta, Amazon", "Find k closest points to (0, 0) using max-heap.", "Heaps", "K Closest Elements");
        upsert("Heaps & Priority Queue", "Kth Largest Element in an Array", 215, "https://leetcode.com/problems/kth-largest-element-in-an-array/", "Medium", "DSA", "Meta, Amazon", "Find kth largest element using quickselect or min-heap.", "Heaps", "QuickSelect / Min-Heap");
        upsert("Heaps & Priority Queue", "Task Scheduler", 621, "https://leetcode.com/problems/task-scheduler/", "Medium", "DSA", "Meta, Google", "Least intervals to execute tasks with cooldown n.", "Heaps", "Greedy Max-Heap");
        upsert("Heaps & Priority Queue", "Design Twitter", 355, "https://leetcode.com/problems/design-twitter/", "Medium", "DSA", "Twitter, Amazon", "Design simplified Twitter supporting post, follow, and getNewsFeed.", "Heaps", "K-Way Merge Heap");
        upsert("Heaps & Priority Queue", "Top K Frequent Words", 692, "https://leetcode.com/problems/top-k-frequent-words/", "Medium", "DSA", "Amazon, Google", "Return k most frequent words sorted by frequency and lexicographical order.", "Heaps", "Custom Heap Comparator");
        upsert("Heaps & Priority Queue", "Furthest Building You Can Reach", 1642, "https://leetcode.com/problems/furthest-building-you-can-reach/", "Medium", "DSA", "Google, Amazon", "Furthest building reachable using bricks and ladders.", "Heaps", "Greedy Min-Heap");
        upsert("Heaps & Priority Queue", "Find Median from Data Stream", 295, "https://leetcode.com/problems/find-median-from-data-stream/", "Hard", "DSA", "Google, Amazon, Meta", "Find median from dynamic data stream using two heaps.", "Heaps", "Two Heaps Pattern");

        // 9. DYNAMIC PROGRAMMING CONCEPT
        upsert("Dynamic Programming", "Climbing Stairs", 70, "https://leetcode.com/problems/climbing-stairs/", "Easy", "DSA", "Amazon, Apple", "Count distinct ways to climb n stairs taking 1 or 2 steps.", "Dynamic Programming", "1D Tabulation");
        upsert("Dynamic Programming", "Min Cost Climbing Stairs", 746, "https://leetcode.com/problems/min-cost-climbing-stairs/", "Easy", "DSA", "Amazon, Apple", "Find minimum cost to reach top of floor.", "Dynamic Programming", "1D State Recurrence");
        upsert("Dynamic Programming", "House Robber", 198, "https://leetcode.com/problems/house-robber/", "Medium", "DSA", "Amazon, Google", "Maximize robbed money without alerting adjacent houses.", "Dynamic Programming", "Non-Adjacent Pick");
        upsert("Dynamic Programming", "House Robber II", 213, "https://leetcode.com/problems/house-robber-ii/", "Medium", "DSA", "Google, Amazon", "Maximize money in circular houses arrangement.", "Dynamic Programming", "Circular DP");
        upsert("Dynamic Programming", "Longest Palindromic Substring", 5, "https://leetcode.com/problems/longest-palindromic-substring/", "Medium", "DSA", "Amazon, Meta", "Find longest palindromic substring in s.", "Dynamic Programming", "2D DP / Expand Center");
        upsert("Dynamic Programming", "Palindromic Substrings", 647, "https://leetcode.com/problems/palindromic-substrings/", "Medium", "DSA", "Meta, Amazon", "Count total palindromic substrings in string.", "Dynamic Programming", "Center Expansion");
        upsert("Dynamic Programming", "Decode Ways", 91, "https://leetcode.com/problems/decode-ways/", "Medium", "DSA", "Amazon, Meta", "Calculate total number of ways to decode encoded message.", "Dynamic Programming", "Linear String DP");
        upsert("Dynamic Programming", "Coin Change", 322, "https://leetcode.com/problems/coin-change/", "Medium", "DSA", "Amazon, Microsoft", "Find fewest coins needed to make up amount.", "Dynamic Programming", "Unbounded Knapsack");
        upsert("Dynamic Programming", "Word Break", 139, "https://leetcode.com/problems/word-break/", "Medium", "DSA", "Amazon, Google, Meta", "Determine if string can be segmented into dictionary words.", "Dynamic Programming", "Trie / Substring DP");

        // 10. INTERVALS & BACKTRACKING CONCEPT
        upsert("Intervals & Backtracking", "Meeting Rooms II", 253, "https://leetcode.com/problems/meeting-rooms-ii/", "Medium", "DSA", "Amazon, Google", "Find minimum conference rooms required using min-heap.", "Intervals & Backtracking", "Min-Heap Chronology");
        upsert("Intervals & Backtracking", "Subsets", 78, "https://leetcode.com/problems/subsets/", "Medium", "DSA", "Meta, Amazon", "Generate power set of unique elements.", "Intervals & Backtracking", "Backtracking Power Set");
        upsert("Intervals & Backtracking", "Subsets II", 90, "https://leetcode.com/problems/subsets-ii/", "Medium", "DSA", "Amazon, Google", "Generate power set handling duplicate elements.", "Intervals & Backtracking", "Pruned Backtracking");
        upsert("Intervals & Backtracking", "Combination Sum", 39, "https://leetcode.com/problems/combination-sum/", "Medium", "DSA", "Amazon, Meta", "Find all unique combinations summing to target.", "Intervals & Backtracking", "Unlimited Pick");
        upsert("Intervals & Backtracking", "Permutations", 46, "https://leetcode.com/problems/permutations/", "Medium", "DSA", "Microsoft, Amazon", "Generate all permutations of distinct integers.", "Intervals & Backtracking", "Swap Permutations");
        upsert("Intervals & Backtracking", "Word Search", 79, "https://leetcode.com/problems/word-search/", "Medium", "DSA", "Amazon, Microsoft", "Search word existence in 2D grid of characters.", "Intervals & Backtracking", "Grid Backtracking");

        // 11. JAVA CONCEPT PROBLEMS (Sorted Easy to Hard)
        // Java OOP
        upsert("Java OOP", "Design an Immutable Class in Java", null, "", "Easy", "Java", "Oracle, Infosys, TCS", "Design a custom ImmutablePerson class with defensive copying of mutable Date and List fields.", "Java OOP", "Defensive Copying");
        upsert("Java OOP", "Implement Deep Copy vs Shallow Copy with Cloneable", null, "", "Easy", "Java", "Cognizant, Wipro", "Implement deep clone vs shallow clone using Cloneable interface and copy constructors.", "Java OOP", "Object Cloning");
        upsert("Java OOP", "Thread-Safe Singleton with Double-Checked Locking", null, "", "Medium", "Java", "Amazon, Goldman Sachs", "Implement thread-safe Singleton with volatile keyword, double-checked locking, and Bill Pugh holder.", "Java OOP", "Double-Checked Locking");
        upsert("Java OOP", "Builder Pattern with Fluent Method Chaining", null, "", "Medium", "Java", "Google, Uber", "Implement thread-safe Builder pattern for a complex UserProfile object with validation.", "Java OOP", "Creational Patterns");
        upsert("Java OOP", "Custom Dynamic Proxy using InvocationHandler", null, "", "Hard", "Java", "Morgan Stanley, Oracle", "Build a runtime logging and transaction proxy using java.lang.reflect.Proxy.", "Java OOP", "Reflection & Dynamic Proxy");

        // Java Collections
        upsert("Java Collections", "Implement Custom Stack using Java Generics", null, "", "Easy", "Java", "Accenture, Capgemini", "Implement a generic MyStack<T> using dynamic arrays and auto-resizing.", "Java Collections", "Generics & Dynamic Array");
        upsert("Java Collections", "Custom HashMap with Bucket Array & Collision Resolution", null, "", "Medium", "Java", "Amazon, Meta, Google", "Implement MyHashMap<K, V> with put, get, remove, hash code distribution, and linked entry chaining.", "Java Collections", "Bucket Chaining");
        upsert("Java Collections", "LRU Cache Design using LinkedHashMap", null, "", "Medium", "Java", "Microsoft, Adobe", "Implement O(1) Least Recently Used cache by overriding LinkedHashMap.removeEldestEntry.", "Java Collections", "LinkedHashMap Override");
        upsert("Java Collections", "Multi-Field Custom Sorting with Comparable & Comparator", null, "", "Medium", "Java", "Walmart, Target", "Sort Employee objects by Department asc, Salary desc, and Name asc using Comparator chaining.", "Java Collections", "Comparator Chaining");
        upsert("Java Collections", "Thread-Safe Bounded Blocking Queue from Scratch", null, "", "Hard", "Java", "Goldman Sachs, JPMorgan", "Implement BoundedBlockingQueue<T> using ReentrantLock and Condition variables.", "Java Collections", "Explicit Locks & Conditions");

        // Java Streams
        upsert("Java Streams", "Filter, Transform and Collect Employee Records", null, "", "Easy", "Java", "Infosys, HCL", "Filter active employees in IT department with salary > 75000 and collect to Map<Id, Name>.", "Java Streams", "Stream Pipelines");
        upsert("Java Streams", "Grouping and Aggregating Data with Collectors.groupingBy", null, "", "Medium", "Java", "Amazon, PayPal", "Group order transactions by currency and compute summary statistics (total, avg, max).", "Java Streams", "Collectors.groupingBy");
        upsert("Java Streams", "Find First Non-Repeating Character with Streams", null, "", "Medium", "Java", "Cisco, Oracle", "Find the first non-repeating character in a string using IntStream and LinkedHashMap frequency counts.", "Java Streams", "Frequency Counting");
        upsert("Java Streams", "Top K Frequent Elements in List using Stream Operations", null, "", "Medium", "Java", "Salesforce, Intuit", "Compute top K frequent items using stream grouping, sorting, and limiting in one statement.", "Java Streams", "Stream Reductions");
        upsert("Java Streams", "Custom Spliterator and Parallel Stream Performance Tuning", null, "", "Hard", "Java", "Netflix, LinkedIn", "Implement a custom Spliterator for chunked processing and benchmark parallel stream speedup.", "Java Streams", "Custom Spliterator");

        // Java Concurrency
        upsert("Java Concurrency", "Print Even and Odd Numbers using Two Synchronized Threads", null, "", "Easy", "Java", "TCS, Mindtree", "Coordinate zero, even, and odd printing sequentially across separate threads using wait() and notify().", "Java Concurrency", "wait() and notify()");
        upsert("Java Concurrency", "Classic Producer-Consumer Pattern using Object Monitor Locks", null, "", "Medium", "Java", "Amazon, VMware", "Implement bounded buffer producer-consumer with synchronized blocks, wait(), and notifyAll().", "Java Concurrency", "Monitor Locks");
        upsert("Java Concurrency", "Producer-Consumer Implementation with ReentrantLock and Condition", null, "", "Medium", "Java", "Goldman Sachs, Morgan Stanley", "Build producer-consumer with ReentrantLock, notFull Condition, and notEmpty Condition.", "Java Concurrency", "Condition Variables");
        upsert("Java Concurrency", "Custom Fixed-Size Thread Pool with Worker Threads", null, "", "Medium", "Java", "Google, Microsoft", "Build MyThreadPool with worker threads, LinkedBlockingQueue task queue, and graceful shutdown.", "Java Concurrency", "ThreadPool & TaskQueue");
        upsert("Java Concurrency", "Deadlock Simulation, Thread Dump Analysis and Resolution", null, "", "Hard", "Java", "JPMorgan, Barclays", "Simulate a 2-thread lock acquisition deadlock, diagnose stack trace, and resolve via global lock ordering.", "Java Concurrency", "Lock Ordering");
        upsert("Java Concurrency", "Asynchronous Microservice Aggregation with CompletableFuture", null, "", "Hard", "Java", "Amazon, Netflix, Uber", "Fetch User, Orders, and Recommendations concurrently using CompletableFuture.allOf() with fallbacks.", "Java Concurrency", "CompletableFuture.allOf");

        // Java Exceptions & I/O
        upsert("Java I/O & Exceptions", "Custom Business Exception Hierarchy with Error Codes", null, "", "Easy", "Java", "Deloitte, EY", "Create an extensible business exception hierarchy with error codes, timestamps, and root cause chaining.", "Java I/O & Exceptions", "Exception Chaining");
        upsert("Java I/O & Exceptions", "High-Performance File Processing with Java NIO FileChannel", null, "", "Medium", "Java", "Walmart, Target", "Process a 500MB log file efficiently using FileChannel, ByteBuffer, and Memory-Mapped Buffer.", "Java I/O & Exceptions", "NIO FileChannel & Buffer");
        upsert("Java I/O & Exceptions", "Custom AutoCloseable Resource with Try-With-Resources", null, "", "Medium", "Java", "Adobe, SAP", "Design a custom connection pool resource implementing AutoCloseable with suppressed exceptions.", "Java I/O & Exceptions", "Try-With-Resources");
        upsert("Java I/O & Exceptions", "Custom Object Serialization with Transient Fields and Encryption", null, "", "Hard", "Java", "Visa, Mastercard", "Implement custom serialization overriding writeObject() and readObject() to encrypt sensitive PII data.", "Java I/O & Exceptions", "writeObject / readObject");

        // Java JVM & Memory
        upsert("Java JVM & Memory", "String Pool Interning and Memory Benchmark", null, "", "Easy", "Java", "Infosys, Wipro", "Demonstrate String literals vs new String() heap allocation and String.intern() deduplication.", "Java JVM & Memory", "String.intern()");
        upsert("Java JVM & Memory", "Simulating Heap OutOfMemoryError and Heap Dump Triage", null, "", "Medium", "Java", "Oracle, Amazon", "Simulate an intentional Java Heap Space OutOfMemoryError and document MAT/VisualVM leak triage.", "Java JVM & Memory", "Heap Dump Analysis");
        upsert("Java JVM & Memory", "Metaspace OutOfMemoryError via Dynamic Class Generation", null, "", "Hard", "Java", "Red Hat, IBM", "Trigger java.lang.OutOfMemoryError: Metaspace by dynamically generating classes with custom ClassLoader.", "Java JVM & Memory", "ClassLoader Leak");

        log.info("Practice problems successfully seeded and categorized!");
    }

    private void upsert(String pattern, String title, Integer num, String url, String diff, String tech, String comp, String desc, String concept, String method) {
        var opt = practiceProblemRepository.findByTitleIgnoreCase(title);
        if (opt.isPresent()) {
            PracticeProblem p = opt.get();
            boolean changed = false;
            if (concept != null && !concept.equals(p.getConcept())) {
                p.setConcept(concept);
                changed = true;
            }
            if (method != null && !method.equals(p.getMethod())) {
                p.setMethod(method);
                changed = true;
            }
            if (tech != null && !tech.equalsIgnoreCase(p.getTechnology())) {
                p.setTechnology(tech);
                changed = true;
            }
            if (diff != null && !diff.equalsIgnoreCase(p.getDifficulty())) {
                p.setDifficulty(diff);
                changed = true;
            }
            if (changed) {
                practiceProblemRepository.save(p);
            }
        } else {
            PracticeProblem p = new PracticeProblem(pattern, title, num, url, diff, tech, comp, desc, concept, method);
            practiceProblemRepository.save(p);
        }
    }

    private void seedRoadmapCourses() {
        if (courseRepository.count() > 0) {
            log.info("Roadmap courses already seeded. Skipping duplicate seeding.");
            return;
        }

        log.info("Seeding predefined technology roadmap courses and topics...");

        // 1. Core Java
        Course cJava = createCourse("Core Java", "Core Java Engineering for 3-Year Developers", "Complete mastery of Java 17/21 language syntax, OOP, Collections, Concurrency, and JVM memory.", "BACKEND", "Intermediate");
        addTopicWithSubtopics(cJava, "Java Syntax, Primitives & Control Flow", "Variables, primitive types, loops, conditionals, methods, and switch expressions.", 1, "Easy", 10,
                List.of("JVM, JRE & JDK architecture", "Data types and scopes", "Conditionals and loops", "Arrays and methods"));
        addTopicWithSubtopics(cJava, "OOP Pillars & Object Modeling", "Encapsulation, inheritance, polymorphism, abstract classes, and interfaces.", 2, "Easy", 12,
                List.of("Classes, objects, constructors", "Inheritance and polymorphism", "Interfaces vs abstract classes", "SOLID principles in Java"));
        addTopicWithSubtopics(cJava, "Java Collections Framework & Generics", "List, Set, Map, Queue, generics, custom sorting, and bucket hashing.", 3, "Medium", 14,
                List.of("ArrayList vs LinkedList", "HashMap internals and bucket hashing", "TreeSet and TreeMap", "Comparable vs Comparator"));
        addTopicWithSubtopics(cJava, "Exception Handling & File I/O", "Try-catch-finally, custom exceptions, NIO.2, and file streams.", 4, "Medium", 8,
                List.of("Checked vs unchecked exceptions", "Try-with-resources", "Custom exception classes", "Java NIO.2 file handling"));
        addTopicWithSubtopics(cJava, "Modern Java: Streams API & Lambdas", "Functional interfaces, Stream pipeline, Optional, and Record classes.", 5, "Medium", 14,
                List.of("Lambda syntax & method references", "Stream intermediate & terminal operations", "Optional idioms", "Java Records & Pattern Matching"));
        addTopicWithSubtopics(cJava, "Multithreading & Concurrency", "Thread lifecycle, synchronization, ExecutorService, and CompletableFuture.", 6, "Hard", 16,
                List.of("Thread lifecycle & locks", "ExecutorService thread pools", "ConcurrentHashMap & atomic classes", "CompletableFuture async pipelines"));
        addTopicWithSubtopics(cJava, "JVM Architecture, Memory & Garbage Collection", "Heap, stack, Metaspace, GC algorithms (G1, ZGC), and memory tuning.", 7, "Hard", 12,
                List.of("JVM memory layout (Heap vs Stack)", "Garbage collection phases & collectors", "Class loading mechanism", "Profiling memory leaks"));

        // 2. Spring Ecosystem & Spring Boot
        Course cSpring = createCourse("Spring Ecosystem", "Spring Boot & Spring Framework Deep Dive", "Enterprise backend development with Spring Core, Spring MVC, Spring Data JPA, and Security.", "BACKEND", "Advanced");
        addTopicWithSubtopics(cSpring, "Spring Core, IoC & Dependency Injection", "ApplicationContext, bean scopes, lifecycle, and component scanning.", 1, "Medium", 10,
                List.of("Inversion of Control container", "Bean scopes (@Singleton, @Prototype)", "Constructor vs field injection", "Spring configuration"));
        addTopicWithSubtopics(cSpring, "Spring Boot & Auto-Configuration", "Starters, application properties, profiles, and runner lifecycle.", 2, "Medium", 8,
                List.of("Spring Boot starters", "Auto-configuration mechanism", "Environment profiles", "Actuator endpoints"));
        addTopicWithSubtopics(cSpring, "RESTful API Design & Spring MVC", "Controllers, request mappings, DTO transformations, and validation.", 3, "Medium", 12,
                List.of("@RestController & HTTP methods", "DTO mapping & validation (@Valid)", "@RestControllerAdvice global exception handling", "Swagger documentation"));
        addTopicWithSubtopics(cSpring, "Spring Data JPA & Hibernate Persistence", "Entity mappings, derived queries, JPQL, relationships, and transactions.", 4, "Hard", 16,
                List.of("@Entity, @Table, and IDs", "@OneToMany & @ManyToOne relationships", "Lazy vs Eager loading & N+1 problem", "@Transactional management"));
        addTopicWithSubtopics(cSpring, "Spring Security 6 & Stateless JWT Auth", "SecurityFilterChain, password hashing, JWT filters, and CORS.", 5, "Hard", 16,
                List.of("SecurityFilterChain configuration", "BCryptPasswordEncoder", "JWT generation & validation filter", "CORS & CSRF defenses"));

        // 3. Database Technologies
        Course cDb = createCourse("Database Technologies", "SQL, MySQL, Redis & Database Architecture", "Relational database modeling, query optimization, indexing, ACID transactions, and Redis caching.", "DATABASE", "Intermediate");
        addTopicWithSubtopics(cDb, "SQL Fundamentals & Relational Schema Design", "DDL, DML, joins, subqueries, grouping, and constraints in MySQL.", 1, "Easy", 10,
                List.of("SELECT, INSERT, UPDATE, DELETE", "INNER, LEFT, RIGHT joins", "Aggregate & window functions", "Foreign keys & normalization"));
        addTopicWithSubtopics(cDb, "Indexing & Query Performance Optimization", "B-Tree indexes, composite indexes, EXPLAIN execution plans, and slow logs.", 2, "Hard", 12,
                List.of("B-Tree index structure", "Composite index order rules", "Using EXPLAIN for query execution", "Slow query log diagnosis"));
        addTopicWithSubtopics(cDb, "Transactions, ACID & Concurrency Control", "Isolation levels, dirty reads, phantom reads, and database locks.", 3, "Hard", 10,
                List.of("ACID properties", "Read Committed vs Repeatable Read", "Pessimistic vs Optimistic locking", "Deadlock resolution"));
        addTopicWithSubtopics(cDb, "Redis Caching & In-Memory Stores", "Cache-aside pattern, TTL expiration, eviction policies, and Spring Cache.", 4, "Medium", 8,
                List.of("Redis data types (String, Hash, Set)", "Cache-Aside pattern implementation", "TTL & eviction policies", "@Cacheable in Spring Boot"));

        // 4. Microservices & Distributed Systems
        Course cMicro = createCourse("Microservices", "Microservices Architecture & Event-Driven Systems", "Designing scalable distributed systems, Spring Cloud, Kafka messaging, and resiliency patterns.", "SYSTEM_DESIGN", "Advanced");
        addTopicWithSubtopics(cMicro, "Service Decomposition & Domain-Driven Design", "Monolith vs Microservices, bounded contexts, and service contracts.", 1, "Medium", 8,
                List.of("Monolith to microservices migration", "Bounded contexts & DDD", "Synchronous vs asynchronous communication", "Database per service"));
        addTopicWithSubtopics(cMicro, "API Gateway & Service Discovery", "Spring Cloud Gateway, Eureka discovery, routing, and centralized filters.", 2, "Medium", 10,
                List.of("Spring Cloud Gateway routing", "Service registry with Eureka", "Client-side load balancing", "Distributed rate limiting"));
        addTopicWithSubtopics(cMicro, "Event-Driven Messaging with Apache Kafka", "Topics, partitions, consumer groups, offsets, and event schemas.", 3, "Hard", 14,
                List.of("Kafka brokers, topics & partitions", "Producers, consumers & consumer groups", "Idempotent event processing", "Dead letter queues"));
        addTopicWithSubtopics(cMicro, "Distributed Resiliency & Fault Tolerance", "Circuit breakers with Resilience4j, retries, and distributed tracing.", 4, "Hard", 12,
                List.of("Circuit breaker state transitions", "Retry policies & fallback methods", "Distributed tracing with Micrometer", "Saga pattern for transactions"));

        // 5. Frontend Development (React)
        Course cFront = createCourse("Frontend Development", "Modern React 19 & Full-Stack UI Engineering", "Semantic HTML5, CSS Grid, Modern JavaScript ES6+, React 19, Hooks, Routing, and REST API integration.", "FRONTEND", "Intermediate");
        addTopicWithSubtopics(cFront, "HTML5, Modern CSS & Responsive Layouts", "Flexbox, CSS Grid, media queries, accessibility, and design tokens.", 1, "Easy", 8,
                List.of("Semantic HTML5 markup", "CSS Flexbox & Grid layouts", "Responsive design breakpoints", "CSS custom properties"));
        addTopicWithSubtopics(cFront, "JavaScript ES6+ Language Core", "Arrow functions, destructuring, promises, async/await, and array methods.", 2, "Easy", 10,
                List.of("let/const scoping", "Array methods (map, filter, reduce)", "Promises & async/await", "ES modules import/export"));
        addTopicWithSubtopics(cFront, "React 19 Components, State & Hooks", "JSX, functional components, useState, useEffect, and custom hooks.", 3, "Medium", 14,
                List.of("Components & props passing", "useState & state immutability", "useEffect lifecycle & cleanup", "Custom hooks creation"));
        addTopicWithSubtopics(cFront, "Single Page Routing & API Integration", "React Router v7, Axios interceptors, protected routes, and auth state.", 4, "Medium", 12,
                List.of("React Router routes & navigation", "Axios client & interceptors", "Bearer token injection", "Protected route guards"));

        // 6. Testing & Code Quality
        Course cTest = createCourse("Testing & Quality", "Unit, Integration & Production Testing in Java", "JUnit 5, Mockito, MockMvc, and Testcontainers for robust enterprise delivery.", "TESTING", "Intermediate");
        addTopicWithSubtopics(cTest, "JUnit 5 & Mockito Unit Testing", "Assertions, test lifecycles, mocks, stubs, and argument captors.", 1, "Medium", 8,
                List.of("JUnit 5 annotations (@Test, @BeforeEach)", "Mockito @Mock and @InjectMocks", "when().thenReturn() stubbing", "Testing exceptions"));
        addTopicWithSubtopics(cTest, "Integration Testing with Spring Boot & MockMvc", "@SpringBootTest, @WebMvcTest, and testing REST controller responses.", 2, "Medium", 10,
                List.of("@SpringBootTest context loading", "@WebMvcTest controller slices", "MockMvc request verification", "Testcontainers with MySQL"));

        // 7. DevOps, Cloud & Deployment (AWS & Docker)
        Course cDevOps = createCourse("DevOps & Cloud", "Docker, CI/CD & AWS Cloud Infrastructure", "Docker containerization, GitHub Actions, AWS EC2, S3, RDS, and cloud deployments.", "DEVOPS", "Intermediate");
        addTopicWithSubtopics(cDevOps, "Docker & Containerization for Spring & React", "Dockerfiles, multi-stage builds, and Docker Compose orchestration.", 1, "Medium", 10,
                List.of("Writing Dockerfile for Java & React", "Multi-stage builds for optimization", "Docker Compose multi-container setup", "Networking & volume persistence"));
        addTopicWithSubtopics(cDevOps, "AWS Cloud Fundamentals for Backend Developers", "IAM, EC2 virtual servers, S3 storage, RDS MySQL, and CloudWatch.", 2, "Hard", 12,
                List.of("AWS IAM roles & security policies", "EC2 instance provisioning", "RDS managed database setup", "S3 file storage integration"));

        // 8. Software Architecture & System Design
        Course cArch = createCourse("System Design", "High-Level & Low-Level System Design", "Scalability, caching, load balancing, database sharding, and real-world system designs.", "SYSTEM_DESIGN", "Advanced");
        addTopicWithSubtopics(cArch, "Architectural Building Blocks & Scalability", "Load balancers, CDN, horizontal scaling, caching strategies, and CAP theorem.", 1, "Hard", 12,
                List.of("Vertical vs horizontal scaling", "Load balancing algorithms", "Database replication & sharding", "CAP theorem & consistency models"));
        addTopicWithSubtopics(cArch, "Real-World System Design Case Studies", "Design URL shortener, Notification system, and E-Commerce order flow.", 2, "Hard", 14,
                List.of("Designing a URL Shortener (TinyURL)", "Designing a Distributed Notification System", "Designing an E-Commerce Order & Inventory Service", "Trade-offs & capacity estimation"));

        // 9. Generative AI & AI-Assisted Development
        Course cAi = createCourse("Generative AI", "AI-Assisted Development & Spring AI Fundamentals", "Prompt engineering, calling LLM APIs, embeddings, and Spring AI integration.", "AI", "Intermediate");
        addTopicWithSubtopics(cAi, "LLMs & Calling AI APIs from Java", "OpenAI & Gemini API integration, structured JSON outputs, and Spring AI.", 1, "Medium", 8,
                List.of("LLM fundamentals & token limits", "Calling AI endpoints via HTTP", "Spring AI starter integration", "Structured JSON output prompts"));

        // 10. Security & Production Readiness
        Course cSec = createCourse("Security", "OWASP Top 10 & Production Security Readiness", "SQL injection, XSS, CSRF, secure headers, secrets management, and auditing.", "SECURITY", "Advanced");
        addTopicWithSubtopics(cSec, "OWASP Top 10 & Defensive Engineering", "Preventing injection attacks, XSS, CSRF, sensitive data leaks, and audit logging.", 1, "Hard", 10,
                List.of("SQL injection & parameterized queries", "XSS & output sanitization", "Secure cookie handling (HttpOnly, SameSite)", "Secrets management in production"));

        // 11. Practical Full-Stack Projects
        Course cProj = createCourse("Practical Projects", "Production-Grade Full-Stack Portfolio Projects", "Building real-world applications connecting Spring Boot, React, MySQL, and Docker.", "PROJECTS", "Advanced");
        addTopicWithSubtopics(cProj, "E-Commerce Microservices & Order Processing", "Microservices system with Order, Cart, Product, and Payment flow.", 1, "Hard", 18,
                List.of("Service contracts & API design", "Kafka event streaming for orders", "MySQL database schema per service", "React storefront integration"));
        addTopicWithSubtopics(cProj, "Developer Job Portal Application", "Complete job board with resume parsing, role filtering, and applications.", 2, "Hard", 16,
                List.of("User roles (Applicant vs Recruiter)", "Spring Data JPA filtering & pagination", "React dashboard & applicant tracking", "Docker deployment"));

        log.info("Successfully seeded 11 comprehensive technology courses with topics and subtopics!");
    }

    private Course createCourse(String tech, String title, String desc, String cat, String level) {
        Course c = new Course(tech, title, desc, cat, level, true);
        return courseRepository.save(c);
    }

    private void addTopicWithSubtopics(Course course, String title, String desc, int order, String diff, int hours, List<String> subtopics) {
        Topic t = new Topic(course.getId(), title, desc, order, diff, hours, "[]", "Build a production-grade implementation for " + title);
        Topic saved = topicRepository.save(t);
        int subOrder = 1;
        for (String sub : subtopics) {
            Subtopic st = new Subtopic(saved.getId(), sub, "Study and implement " + sub, subOrder++);
            subtopicRepository.save(st);
        }
    }
}
