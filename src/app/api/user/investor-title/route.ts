import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 200,
    data: {
      title: "Building India's Most Premium Cinema Network.",
      subTitle: "Connplex Cinemas Limited is committed to delivering world-class cinematic experiences through innovation, operational excellence and a scalable franchise model.",
      investorHeading: "Investor Grievances",
      investorSubHeading: "For any investor complaints/grievances, kindly mail us on:",
      email_one: "connplex.smeipo@linkintime.co.in",
      email_two: "investor@connplex.com",
      email_three: "grievance@theconnplex.com"
    }
  });
}
