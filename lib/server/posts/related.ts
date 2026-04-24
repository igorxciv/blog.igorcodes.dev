import type { PostSummary } from "@/lib/types/posts";

type RelatedPostCandidate = {
  post: PostSummary;
  score: number;
};

const RELATED_POSTS_LIMIT = 3;

function countSharedValues(left: string[], right: string[]): number {
  const rightValues = new Set(right);
  return left.filter((value) => rightValues.has(value)).length;
}

function scoreRelatedPost(sourcePost: PostSummary, candidatePost: PostSummary): number {
  const sharedTopics = countSharedValues(sourcePost.topics, candidatePost.topics);
  const sharedTags = countSharedValues(sourcePost.tags, candidatePost.tags);

  return sharedTopics * 3 + sharedTags;
}

function sortByScoreThenDate(left: RelatedPostCandidate, right: RelatedPostCandidate): number {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  return right.post.date.localeCompare(left.post.date);
}

export function getRelatedPosts(
  sourcePost: PostSummary,
  posts: PostSummary[],
  limit = RELATED_POSTS_LIMIT
): PostSummary[] {
  const candidates = posts.filter((post) => post.slug !== sourcePost.slug);
  const scoredCandidates = candidates
    .map((post) => ({
      post,
      score: scoreRelatedPost(sourcePost, post),
    }))
    .sort(sortByScoreThenDate);

  const relatedPosts = scoredCandidates.filter((candidate) => candidate.score > 0);
  const fallbackPosts = scoredCandidates.filter((candidate) => candidate.score === 0);

  return [...relatedPosts, ...fallbackPosts].slice(0, limit).map((candidate) => candidate.post);
}
