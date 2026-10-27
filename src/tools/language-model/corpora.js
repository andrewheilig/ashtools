export const CORPORA = {
  formal: {
    label: 'Formal mathematics (default)',
    description: 'Definitions, theorems, formal problems, proofs, and constructions.',
    text: `D:N={0,1,2,3,...} <eos>
    D:Z={...,−2,−1,0,1,2,...} <eos>
    D:Q={a/b|a,b∈Z∧b≠0} <eos>
    D:∀a,b∈Z[a|b⇔∃k∈Z[b=ak]] <eos>
    D:∀a,b∈Z[gcd(a,b)=gcd(b,a)] <eos>
    D:∀a,b∈Z[lcm(a,b)*gcd(a,b)=|ab|] <eos>
    D:prime(n)⇔n>1∧∀d∈N+[d|n⇒d=1∨d=n] <eos>
    D:even(n)⇔n mod 2=0 <eos>
    D:odd(n)⇔n mod 2=1 <eos>
    D:coprime(a,b)⇔gcd(a,b)=1 <eos>
    D:F(0)=0∧F(1)=1 <eos>
    D:∀n≥0[F(n+2)=F(n+1)+F(n)] <eos>
    D:L(0)=2∧L(1)=1 <eos>
    D:∀n≥0[L(n+2)=L(n+1)+L(n)] <eos>
    D:T(0)=0 <eos>
    D:∀n≥0[T(2n)=T(n)] <eos>
    D:∀n≥0[T(2n+1)=1−T(n)] <eos>
    D:binom(n,k)=n!/(k!(n−k)!) <eos>
    D:factorial(0)=1 <eos>
    D:∀n≥0[factorial(n+1)=(n+1)*factorial(n)] <eos>
    D:sum(S)=Σ(i=1..length(S),S[i]) <eos>
    D:mean(S)=sum(S)/length(S) <eos>
    D:range(a,b)={a,a+1,...,b} <eos>
    D:cardinality(S)=|S| <eos>
    D:subset(A,B)⇔∀x[x∈A⇒x∈B] <eos>
    D:distance2(p,q)=(px−qx)^2+(py−qy)^2 <eos>
    D:dot(p,q)=px*qx+py*qy <eos>
    D:cross(p,q)=px*qy−py*qx <eos>
    D:rotate90(x,y)=(−y,x) <eos>
    D:reflectX(x,y)=(x,−y) <eos>
    D:reflectY(x,y)=(−x,y) <eos>
    D:area2(p,q,r)=|cross(q−p,r−p)| <eos>
    D:collinear(p,q,r)⇔cross(q−p,r−p)=0 <eos>
    D:adjacent(u,v,G)⇔{u,v}∈E(G) <eos>
    D:degree(v,G)=|{u∈V(G)|adjacent(u,v,G)}| <eos>
    D:independent(S,G)⇔∀u,v∈S[u≠v⇒¬adjacent(u,v,G)] <eos>
    D:properColoring(c,G)⇔∀{u,v}∈E(G)[c(u)≠c(v)] <eos>
    D:palindrome(w)⇔reverse(w)=w <eos>
    D:period(w,p)⇔∀i[0≤i<length(w)−p⇒w[i]=w[i+p]] <eos>
    D:reachable(s,t,M)⇔∃k≥0[iterate(M,s,k)=t] <eos>
    
    T:∀a,b∈Z[a+b=b+a] <eos>
    T:∀a,b,c∈Z[a+(b+c)=(a+b)+c] <eos>
    T:∀a,b,c∈Z[a(b+c)=ab+ac] <eos>
    T:∀a∈Z[a+0=a] <eos>
    T:∀a∈Z[a*1=a] <eos>
    T:∀a∈Z[a*0=0] <eos>
    T:∀a∈Z[a^2≥0] <eos>
    T:∀a,b∈Z[(a+b)^2=a^2+2ab+b^2] <eos>
    T:∀a,b∈Z[(a−b)(a+b)=a^2−b^2] <eos>
    T:∀a,b∈Z[(a+b)^3=a^3+3a^2b+3ab^2+b^3] <eos>
    T:∀a,b∈Z[gcd(a,b)|a∧gcd(a,b)|b] <eos>
    T:∀a,b∈Z[a|b⇒a|bc] <eos>
    T:∀a,b,c∈Z[a|b∧b|c⇒a|c] <eos>
    T:∀a,b∈Z[gcd(a,b)=gcd(a,b+a)] <eos>
    T:∀a,b,k∈Z[gcd(a,b)=gcd(a,b+ka)] <eos>
    T:∀a,b∈N+[gcd(a,b)*lcm(a,b)=ab] <eos>
    T:∀n∈N[n(n+1) mod 2=0] <eos>
    T:∀n∈N[(n^3−n) mod 6=0] <eos>
    T:∀n∈N[n^2 mod 4∈{0,1}] <eos>
    T:∀n∈N[n^2 mod 3∈{0,1}] <eos>
    
    T:∀n∈N+[Σ(k=1..n,k)=n(n+1)/2] <eos>
    T:∀n∈N+[Σ(k=1..n,2k)=n(n+1)] <eos>
    T:∀n∈N+[Σ(k=1..n,k^2)=n(n+1)(2n+1)/6] <eos>
    T:∀n∈N+[Σ(k=1..n,(2k−1))=n^2] <eos>
    T:∀n∈N+[Σ(k=0..n,binom(n,k))=2^n] <eos>
    T:∀n∈N+[binom(n,0)=1] <eos>
    T:∀n∈N+[binom(n,n)=1] <eos>
    T:∀n≥1[∀k∈[1..n][binom(n,k)=binom(n,n−k)]] <eos>
    T:∀n≥1[∀k∈[1..n][binom(n,k)=binom(n−1,k)+binom(n−1,k−1)]] <eos>
    T:∀n≥0[F(n+2)=F(n+1)+F(n)] <eos>
    T:∀n≥0[F(2n)=F(n)(F(n−1)+F(n+1))] <eos>
    T:∀n≥0[L(n)=F(n−1)+F(n+1)] <eos>
    T:∀n≥0[T(2n)=T(n)] <eos>
    T:∀n≥0[T(2n+1)=1−T(n)] <eos>
    
    T:∀A,B[A∪B=B∪A] <eos>
    T:∀A,B[A∩B=B∩A] <eos>
    T:∀A[A∪∅=A] <eos>
    T:∀A[A∩A=A] <eos>
    T:∀A,B[A⊆A∪B] <eos>
    T:∀A,B[A∩B⊆A] <eos>
    T:∀A,B,C[A∩(B∪C)=(A∩B)∪(A∩C)] <eos>
    T:∀A,B,C[A∪(B∩C)=(A∪B)∩(A∪C)] <eos>
    
    T:∀p,q[distance2(p,q)=distance2(q,p)] <eos>
    T:∀p[distance2(p,p)=0] <eos>
    T:∀p[distance2(rotate90(p),O)=distance2(p,O)] <eos>
    T:∀p[distance2(reflectX(p),O)=distance2(p,O)] <eos>
    T:∀p,q[dot(p,q)=dot(q,p)] <eos>
    T:∀p,q[cross(p,q)=−cross(q,p)] <eos>
    T:∀p,q[cross(p,q)=0⇔collinear(O,p,q)] <eos>
    T:∀p,q,r[area2(p,q,r)=area2(q,r,p)] <eos>
    T:∀p,q,r[area2(p,q,r)=area2(p,r,q)] <eos>
    
    T:∀G[Σ(v∈V(G),degree(v,G))=2*|E(G)|] <eos>
    T:∀G[|{v∈V(G)|odd(degree(v,G))}| mod 2=0] <eos>
    T:∀G[χ(G)≤|V(G)|] <eos>
    T:∀G[α(G)≥1] | |V(G)|≥1 <eos>
    T:∀G[α(G)≤|V(G)|] <eos>
    T:∀G[|E(complement(G))|=binom(|V(G)|,2)−|E(G)|] <eos>
    
    P:FIND(x∈Z|3x+7=22) <eos>
    P:FIND(x∈Q|9x−5x−5=2) <eos>
    P:FIND(x∈Q|x/(x+9)=2/3) <eos>
    P:FIND(x∈Z|x^2−7x+12=0) <eos>
    P:FIND((x,y)∈Z^2|x+y=13∧x−y=3) <eos>
    P:FIND(x∈N|x mod 3=2∧x mod 5=4∧x<50) <eos>
    P:COUNT(x∈[1..100]|x mod 4=1) <eos>
    P:COUNT(x∈[1..200]|prime(x)) <eos>
    P:MAX(x∈Z|x^2−9x+18≤0) <eos>
    P:MIN(x∈Z|x>0∧x mod 4=3∧x mod 5=2) <eos>
    
    P:FIND(n∈N|Σ(k=1..n,k)=210) <eos>
    P:FIND(n∈N|binom(n,2)=45) <eos>
    P:FIND(x∈N|gcd(x,18)=6∧lcm(x,18)=90) <eos>
    P:COUNT(S⊆{1,2,3,4,5}|cardinality(S)=3) <eos>
    P:MAX(cardinality(S)|S⊆V(G)∧independent(S,G)) <eos>
    P:COUNT(c:V(G)→{1,2,3}|properColoring(c,G)) <eos>
    
    P:FIND(p∈Z^2|distance2(p,O)=25∧px>0∧py>0) <eos>
    P:COUNT(p∈Z^2|distance2(p,O)=25) <eos>
    P:MAX(area2(O,p,q)|p,q∈{0..4}^2) <eos>
    P:FIND(x∈Z|distance2((x,3),O)=34) <eos>
    P:COUNT((a,b)∈N^2|a≤b≤20∧a^2+b^2=125) <eos>
    
    P:PROVE(∀n∈N[n(n+1) mod 2=0]) <eos>
    P:PROVE(∀n∈N[(n^3−n) mod 6=0]) <eos>
    P:PROVE(∀a,b∈Z[gcd(a,b)=gcd(a,b+a)]) <eos>
    P:PROVE(∀A,B[A∩B⊆A∪B]) <eos>
    P:PROVE(∀p,q[distance2(p,q)=distance2(q,p)]) <eos>
    P:PROVE(∀G[Σ(v∈V(G),degree(v,G))=2|E(G)|]) <eos>
    
    P:DETERMINE(∀n≥1[F(n)>0]) <eos>
    P:DETERMINE(∀n∈N[n^2 mod 4∈{0,1}]) <eos>
    P:DETERMINE(∀n∈N[n^2 mod 4=1]) <eos>
    P:DETERMINE(∀x∈Z[x^2≥x]) <eos>
    
    P:CONSTRUCT(S⊆{1..10}|cardinality(S)=4∧sum(S)=20) <eos>
    P:CONSTRUCT(p,q,r∈Z^2|area2(p,q,r)=12) <eos>
    P:CONSTRUCT(G|cardinality(V(G))=6∧cardinality(E(G))=9) <eos>
    P:CONSTRUCT(w∈{0,1}^8|ones(w)=4∧palindrome(w)) <eos>
    
    `
  },
  arithmetic: {
    label: 'Arithmetic facts',
    description: 'Addition, subtraction, multiplication, percentages, and equations.',
    text: `what is 12 plus 7? the answer is 19. <eos>
what is 28 plus 35? the answer is 63. <eos>
what is 91 minus 46? the answer is 45. <eos>
what is 72 minus 19? the answer is 53. <eos>
what is 8 times 9? the answer is 72. <eos>
what is 14 times 6? the answer is 84. <eos>
25 percent of 80 is 20. <eos>
40 percent of 150 is 60. <eos>
solve 3x + (4) = 25. the solution is x = 7. <eos>
solve 5x + (-10) = 30. the solution is x = 8. <eos>
a bag has 7 red beads and 11 blue beads. there are 18 beads. <eos>
6 notebooks cost 42 dollars. each costs 7 dollars. <eos>
the pattern 2, 5, 8, 11 adds 3 each time. <eos>
the pattern 10, 15, 20, 25 adds 5 each time. <eos>`,
  },
  language: {
    label: 'Language patterns',
    description: 'Simple descriptive and narrative sentence structures.',
    text: `at the library, an artist asks a question. <eos>
near the river, a gardener reads a book. <eos>
in the morning, a student solves a puzzle. <eos>
after the lesson, a teacher explains the result. <eos>
the room is small, but the other one is bright. <eos>
the stone is rough, but the other one is smooth. <eos>
a scientist checks the clock at the station. <eos>
a programmer writes a note before lunch. <eos>
the cat sleeps quietly in the sun. <eos>
the dog runs quickly through the garden. <eos>
a child finds a pattern and explains the idea. <eos>
a baker counts the steps near the river. <eos>`,
  },
  reasoning: {
    label: 'Reasoning statements',
    description: 'Definitions, comparisons, conjectures, and counterexamples.',
    text: `a prediction is not always the same as an observation. <eos>
a sample is a subset of a population. <eos>
a median is the middle value of sorted data. <eos>
a mean is the total divided by the count. <eos>
a counterexample disproves a general claim. <eos>
a pattern may suggest a useful conjecture. <eos>
correlation does not by itself establish causation. <eos>
an outlier is far from most observations. <eos>
to check a claim, try a smaller example first. <eos>
an invariant remains unchanged during an allowed move. <eos>
evidence can support a claim without proving it. <eos>
a square is a rectangle with four equal sides. <eos>`,
  },
};

export function prepareCustomCorpus(text) {
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => line.includes('<eos>') ? line : `${line} <eos>`)
    .join('\n');
}
