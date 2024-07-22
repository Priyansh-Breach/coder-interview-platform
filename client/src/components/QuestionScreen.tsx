/**
 * v0 by Vercel.
 * @see https://v0.dev/t/KYxq7corXKC
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Component() {
  return (
    <div className="p-6   min-h-screen">
      <div className="max-w-3xl mx-auto">
        <header className="border-b border-gray-700 pb-4 mb-4">
          <h1 className="text-2xl font-bold">1. Two Sum</h1>
          <div className="flex items-center space-x-2 mt-2">
            <span className="bg-green-600 text-xs font-semibold px-2 py-1  text-white  rounded">Easy</span>
            <span className="bg-gray-700  text-xs font-semibold px-2 py-1 text-white rounded">Topics</span>
            <span className="bg-gray-700  text-xs font-semibold px-2 py-1  text-white rounded">Companies</span>
            <span className="bg-gray-700  text-xs font-semibold px-2 py-1 text-white rounded">Hint</span>
          </div>
        </header>
        <section>
          <p className="mb-4">
            Given an array of integers <code>nums</code> and an integer <code>target</code>, return{" "}
            <strong>indices of the two numbers</strong> such that they add up to <code>target</code>.
          </p>
          <p className="mb-4">
            You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the{" "}
            <strong>same</strong> element twice.
          </p>
          <p className="mb-4">You can return the answer in any order.</p>
        </section>
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Example 1:</h2>
            <pre className="dark:bg-stone-900 bg-[#000a2008] border-[#0000000d] p-4 rounded-md">
              <code>
                Input: nums = [2,7,11,15], target = 9
                <br />
                Output: [0,1]
                <br />
                Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
              </code>
            </pre>
          </div>
          
        </section>
        <section className="mt-6">
          <h2 className="text-lg font-semibold">Constraints:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <code>
                2 ≤ nums.length ≤ 10<sup>4</sup>
              </code>
            </li>
            <li>
              <code>
                -10<sup>9</sup> ≤ nums[i] ≤ 10<sup>9</sup>
              </code>
            </li>
            <li>
              <code>
                -10<sup>9</sup> ≤ target ≤ 10<sup>9</sup>
              </code>
            </li>
            <li>Only one valid answer exists.</li>
          </ul>
        </section>
        <section className="mt-6">
          <h2 className="text-lg font-semibold">Follow-up:</h2>
          <p>
            Can you come up with an algorithm that is less than{" "}
            <code>
              O(n<sup>2</sup>)
            </code>{" "}
            time complexity?
          </p>
        </section>
      </div>
    </div>
  )
}