'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate loading delay
    console.log('user', user);
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  if (isLoading) {
    return <div className="bg-white min-h-screen"></div>;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-blue-900/5"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-blue-800/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-6">
                <span className="block">Collaborate on documents,</span>{' '}
                <span className="block bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 bg-clip-text text-transparent">
                  share with confidence.
                </span>
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                CoDocs empowers teams to create, edit, and share documents together in real-time.
                Secure collaboration with powerful sharing controls and seamless team workflows.
              </p>
              <div className="mt-10 flex space-x-0 md:space-x-4 flex-col md:flex-row">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={user ? '/notes' : '/sign-up'}
                    className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg transform transition-all duration-200"
                  >
                    {user ? 'View My Documents' : 'Start Collaborating'}
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-10 md:mt-0"
                >
                  <a
                    href="#features"
                    className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all duration-200"
                  >
                    Learn More
                  </a>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-12 lg:mt-0 flex justify-center"
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl max-w-md">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-blue-700/5 to-blue-900/10 rounded-xl"></div>
                <Image
                  src="/images/preview.jpeg"
                  alt="CoDocs App Preview"
                  width={600}
                  height={400}
                  quality={90}
                  className="w-full h-auto relative z-10"
                  priority
                />
                <div className="absolute inset-0 ring-1 ring-blue-200/50 rounded-xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Features
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Built for seamless collaboration
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Create, share, and collaborate on documents with your team in real-time.
            </p>
          </motion.div>
          <div className="mt-16 max-w-5xl mx-auto">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {[
                {
                  title: 'Real-time Collaboration',
                  description: 'Edit documents together with your team and see changes instantly.',
                  gradient: 'from-blue-500 to-blue-700',
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  ),
                },
                {
                  title: 'Smart Sharing Controls',
                  description:
                    'Control who can view, edit, or comment on your documents with granular permissions.',
                  gradient: 'from-blue-600 to-blue-800',
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                  ),
                },
                {
                  title: 'Version History',
                  description:
                    'Track changes and restore previous versions with complete revision history.',
                  gradient: 'from-blue-700 to-blue-900',
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r ${feature.gradient} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* App Screenshot Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-blue-50/40 to-sky-50/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Powerful Interface
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Designed for productive collaboration
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              CoDocs&apos;s intuitive interface makes document collaboration effortless, whether
              you&apos;re working solo or with a team.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-blue-700/3 to-blue-900/8"></div>
              <Image
                src="/images/collab.jpeg"
                alt="CoDocs App Interface"
                width={1200}
                height={800}
                className="w-full h-auto relative z-10 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 ring-1 ring-blue-200/30 rounded-xl"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hidden sm:flex items-center justify-center shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-transparent to-blue-900/30"></div>
        <div className="relative max-w-7xl mx-auto py-12 px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-0 lg:flex-1"
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to collaborate?
            </h2>
            <p className="mt-3 max-w-3xl text-lg leading-6 text-blue-100">
              Join thousands of teams who streamline their document workflows with CoDocs. Start
              collaborating today and experience seamless teamwork.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 lg:mt-0 lg:ml-8"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={user ? '/documents' : '/sign-up'}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {user ? 'Go to documents' : 'Start collaborating free'}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
