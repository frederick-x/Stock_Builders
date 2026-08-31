// ============================================================================
// STOCKBUILDERS Negotiation Engine (Agent-to-Agent Simulated Protocol)
// ============================================================================

export function generateNegotiationScript(userAgent, targetAgent, goal) {
  const basePrice = targetAgent.basePrice;
  const userBudget = userAgent.maxBudgetPerJob || 500;
  
  // Determine opening offer based on user agent behavior
  let discountPercent = 0.20; // 20% discount ask
  if (userAgent.behavior === 'SAFE') discountPercent = 0.12;
  if (userAgent.behavior === 'BOLD') discountPercent = 0.28;

  const openingOffer = Math.round(basePrice * (1 - discountPercent));
  const counterOffer = Math.round(basePrice * (1 - discountPercent * 0.45));
  const finalAgreedPrice = Math.round(basePrice * (1 - discountPercent * 0.65));

  const rounds = [
    {
      round: 1,
      sender: userAgent.name,
      senderOrb: userAgent.orbColor || 'violet',
      message: `Greetings ${targetAgent.name}! I'm representing my creator on goal: "${goal?.title || 'Contract Deliverable'}". Your base listing is ${basePrice} Tokens, but we offer ${openingOffer} Tokens for immediate assignment.`,
      offer: openingOffer,
      rationale: `${userAgent.name} opens with an assertive proposal to secure optimal budget efficiency for your goal.`,
    },
    {
      round: 2,
      sender: targetAgent.name,
      senderOrb: targetAgent.orbColor || 'pink',
      message: `Hello ${userAgent.name}. My queue is in high demand, but I appreciate your prompt contract terms. ${openingOffer} Tokens is too steep of a discount for my Diamond-tier deliverable. How about ${counterOffer} Tokens with priority turnaround?`,
      offer: counterOffer,
      rationale: `${targetAgent.name} acknowledges high reputation standing and provides a high-priority expedited counter-offer.`,
    },
    {
      round: 3,
      sender: userAgent.name,
      senderOrb: userAgent.orbColor || 'violet',
      message: `We can meet in the middle at ${finalAgreedPrice} Tokens if you include all source deliverables and sub-second asset rendering.`,
      offer: finalAgreedPrice,
      rationale: `${userAgent.name} identifies a win-win compromise within the target budget threshold.`,
    },
    {
      round: 4,
      sender: targetAgent.name,
      senderOrb: targetAgent.orbColor || 'pink',
      message: `Deal accepted! ${finalAgreedPrice} Tokens locked in escrow. Initializing autonomous pipeline now.`,
      offer: finalAgreedPrice,
      rationale: `Mutual handshake achieved. ${targetAgent.name} has signed the virtual contract at ${finalAgreedPrice} Tokens.`,
      isFinal: true,
      dealResult: {
        agreedPrice: finalAgreedPrice,
        discountEarned: basePrice - finalAgreedPrice,
        discountPercent: Math.round(((basePrice - finalAgreedPrice) / basePrice) * 100),
        tokensSaved: basePrice - finalAgreedPrice,
        estimatedPayout: Math.round(finalAgreedPrice * 1.6), // Simulated gross yield upon completion
        netProfit: Math.round(finalAgreedPrice * 0.6),
      }
    }
  ];

  return rounds;
}
